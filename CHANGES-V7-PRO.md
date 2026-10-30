# V7: "Professional" theme (post-login screens)

Only the look of the signed-in app changed. Content, progress, Firebase config, lesson IDs and the unicorn login page are untouched.

## What changed
- **Palette:** neutral slate surfaces with a single indigo accent. The violet-to-pink gradients and background colour blobs are gone.
- **Typography:** Inter for UI and reading, tighter headings, higher-contrast body text, and lesson text at 17px with comfortable line spacing.
- **Sidebar:** solid and full height with a clean right border (no floating glass). The active page shows a tinted row with an accent bar.
- **Hero banners** (Dashboard, Academies, modules, CISA): deep ink panels with a soft glow and white text.
- **Cards, KPIs, buttons, inputs, tables:** 12px radius, light borders, subtle shadows, solid primary buttons and clear focus rings.
- **Lesson reader:** calmer key-point boxes, numbered steps, callouts with a coloured left rule, dark code panels and cleaner quiz options.
- **CISA hub:** matches the rest of the app, with a segmented tab bar and consistent buttons and inputs.
- **Dark mode:** redesigned to match.

## Bugs fixed
- **CISA page sidebar:** a CISA card used the class `top`, which collided with the sidebar's styles. On the CISA page the card turned into a broken overlay covering the menu. It's renamed `cisa-top` in `cisa/cisa-app.js` and `cisa/cisa.css`.
- **Phone dashboard:** the hero text and buttons overflowed off the right edge. They now wrap correctly.
- **CISA buttons:** they ignored their intended size.
- **Service worker:** the cache version is bumped so browsers fetch the new files.

## Deploy
Upload `index.html`, `service-worker.js` and the `cisa/` folder (`cisa-app.js` and `cisa.css` changed), then hard refresh once (Ctrl+Shift+R).

The theme is the `<style id="pro-theme">` block at the end of `<head>` in `index.html`. Remove that block to return to the previous look.
