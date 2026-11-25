# Releasing

`loseta` is published to npm from the **Publish** workflow
(`.github/workflows/publish.yml`) when a GitHub release is published. The
workflow validates the registry, checks that the release tag matches the package
version, and publishes `packages/loseta` with provenance through npm trusted
publishing.

## Trusted publishing

`loseta` is bound to `.github/workflows/publish.yml` in `vladiantio/loseta` with
**Allow npm publish** enabled. GitHub Actions obtains a short-lived OIDC token
and npm verifies the workflow and repository before accepting the publish; no
npm token secret is required.

If the binding has to be recreated:

```bash
npm login
npm trust github loseta \
  --file publish.yml \
  --repo vladiantio/loseta \
  --allow-publish \
  --yes
```

`npm trust` requires npm 11.15 or later and an account with 2FA enabled. You can
also configure it in the package settings on npmjs.com and select **Allow npm
publish**.

A new trusted publisher must complete its first successful publish within two
days, or it expires and must be recreated. Configure it when you are ready to
ship the next version, not months in advance.

Keep the package's **Publishing access** set to **Require two-factor
authentication and disallow tokens**. The workflow authenticates through OIDC,
not through a repository secret.

## Subsequent releases

1. Ensure `packages/loseta/package.json` carries the target version, and add
   one dated `CHANGELOG.md` section for it. The registry is versioned by the
   wire `schemaVersion`, not by the package version. `minCliVersion` in
   `packages/loseta/registry/registry.json` names the oldest CLI that may read
   the served catalog. The version bump and changelog may already be part of a
   feature commit; do not rewrite unpushed history just to separate them. Keep
   one changelog section per published version; if planned releases are
   collapsed into one, fold their entries into the released version instead of
   leaving sections for versions npm never received.
2. Deploy the registry and the CLI in the safe order. For the first remote
   release, deploy the docs site and confirm `/r/registry.json` and
   `/schema/v1/` are live, then publish `0.20.0`; older bundled CLIs keep
   working meanwhile. For later releases that raise `minCliVersion`, publish
   the CLI first and deploy the registry second, so existing remote CLIs do not
   hit a catalog that requires an unpublished version.
3. Run the full gate and regenerate artifacts:

   ```bash
   pnpm test
   pnpm registry:examples
   pnpm docs:css
   git diff --exit-code web/src/styles/loseta.css web/public/styles packages/loseta/registry
   pnpm registry:remote
   ```

   For visual, behavior or docs changes, run `pnpm gate:e2e` once after the
   diff is final.
4. Commit any release-only changes (regenerated examples, changelog or version
   updates that are not already committed):

   ```bash
   git commit -am "chore(release): 0.2.0"
   ```

   If the tree is already clean, skip this commit and tag the current `HEAD`.
   The sidebar example version labels follow `package.json`, so regenerating
   examples is enough; do not edit them by hand.
5. Verify the release metadata, then tag:

   ```bash
   pnpm release:check
   git tag -a v0.2.0 -m "loseta 0.2.0"
   pnpm release:check
   ```

   The first check requires `main`, a clean tree, a dated changelog section and
   current example labels; it reports when the repository is ready to tag. The second verifies
   that the annotated tag points at `HEAD`. Preparation ends here; the
   remaining steps push and publish.
6. Push and publish:

   ```bash
   git push origin main
   git push origin v0.2.0
   gh release create v0.2.0 --title "v0.2.0" --generate-notes
   ```
7. Watch the **Publish** workflow and verify the result:

   ```bash
   npm view loseta version
   npx loseta --help
   ```

The workflow skips publishing when the version already exists, so a re-run after
a partial failure is safe. It also runs `pnpm release:check --ci` against the
release tag before publishing.
