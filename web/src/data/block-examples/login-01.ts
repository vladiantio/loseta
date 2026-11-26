export const login01Html = `<div style="inline-size: 100%; min-inline-size: 0; min-block-size: 40rem; display: grid; place-items: center; padding: clamp(1rem, 4vw, 2rem); box-sizing: border-box">
  <form class="card" action="#" method="get" style="inline-size: min(100%, 24rem)">
    <header>
      <h2 data-slot="title">Welcome back</h2>
      <p data-slot="description">Sign in to continue to your workspace.</p>
      <a data-slot="action" href="#">Create account</a>
    </header>
    <section>
      <div class="fieldset">
        <div class="field">
          <label class="label" for="block-login-01-email">Email</label>
          <input class="input" id="block-login-01-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        </div>
        <div class="field">
          <div style="display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.5rem">
            <label class="label" for="block-login-01-password">Password</label>
            <a href="#">Forgot password?</a>
          </div>
          <input class="input" id="block-login-01-password" name="password" type="password" autocomplete="current-password" required>
        </div>
        <div class="field" data-orientation="horizontal">
          <input class="checkbox" id="block-login-01-remember" name="remember" type="checkbox" checked>
          <label class="label" for="block-login-01-remember">Remember me</label>
        </div>
      </div>
    </section>
    <footer style="flex-direction: column; align-items: stretch; gap: 0.5rem">
      <button class="btn" type="button">Sign in</button>
      <button class="btn" data-variant="outline" type="button">Continue with Google</button>
    </footer>
  </form>
</div>`;
