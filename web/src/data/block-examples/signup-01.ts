export const signup01Html = `<div style="inline-size: 100%; min-inline-size: 0; min-block-size: 40rem; display: grid; place-items: center; padding: clamp(1rem, 4vw, 2rem); box-sizing: border-box">
  <form class="card" action="#" method="get" style="inline-size: min(100%, 24rem)">
    <header>
      <h2 data-slot="title">Create your account</h2>
      <p data-slot="description">Start your 14-day trial. No credit card required.</p>
      <a data-slot="action" href="#">Sign in</a>
    </header>
    <section>
      <div class="fieldset">
        <div class="field">
          <label class="label" for="block-signup-01-name">Name</label>
          <input class="input" id="block-signup-01-name" name="name" type="text" autocomplete="name" placeholder="Ada Lovelace" required>
        </div>
        <div class="field">
          <label class="label" for="block-signup-01-email">Email</label>
          <input class="input" id="block-signup-01-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        </div>
        <div class="field">
          <label class="label" for="block-signup-01-password">Password</label>
          <input class="input" id="block-signup-01-password" name="password" type="password" autocomplete="new-password" minlength="8" aria-describedby="block-signup-01-password-hint" required>
          <p id="block-signup-01-password-hint">Use at least eight characters.</p>
        </div>
        <div class="field" data-orientation="horizontal">
          <input class="checkbox" id="block-signup-01-terms" name="terms" type="checkbox" aria-describedby="block-signup-01-terms-description" required>
          <section>
            <label class="label" for="block-signup-01-terms">Accept terms</label>
            <p id="block-signup-01-terms-description">Agree to the <a href="#">terms of service</a> and <a href="#">privacy policy</a>.</p>
          </section>
        </div>
      </div>
    </section>
    <footer style="flex-direction: column; align-items: stretch; gap: 0.5rem">
      <button class="btn" type="button">Create account</button>
      <button class="btn" data-variant="outline" type="button">Continue with Google</button>
    </footer>
  </form>
</div>`;
