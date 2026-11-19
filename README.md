# Mom's Color Studio

A free, ad-free color-by-number web app packaged for GitHub Pages and offline use.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to the `main` branch.
2. In **Settings → Pages**, set **Build and deployment** to **Deploy from a branch**, select `main` and `/ (root)`, then Save.
3. Wait for the Pages deployment to finish. The permanent address is `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Every push to the selected branch updates the live site automatically.

## Install on iPad

1. Open the published HTTPS address in Safari while online.
2. Wait for the first visit to finish, so the app shell can be cached.
3. Tap **Share → Add to Home Screen**.
4. After the first successful load, the app can reopen without an internet connection.

The browser's local storage remains the source of saved coloring progress. Keep using the same site address and browser profile to retain it. The storage key and saved data format from the original app are unchanged.

## Files

- `index.html` — original application with bundled styles and local system fonts.
- `manifest.json` — install metadata.
- `service-worker.js` — offline app-shell caching and update handling.
- `icon.svg` — home-screen icon.
