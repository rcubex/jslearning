# V9: Sunset theme

The whole signed-in app now uses the "Sunset Header" design. The login page, content, saved progress and every feature are unchanged.

## What changed
- **Top navigation replaces the sidebar.**
  - Dashboard, Technical, GRC, Application and CISA Hub sit in a bar along the top.
  - "Track" and "Tools" open dropdown menus.
  - The round account button opens progress, sync status, Theme and Sign out.
  - On phones, the ☰ menu still opens the full list.
- **Gradient band.**
  - An orange-to-pink band (#FF7A59 → #FF4F8B) runs across the top of every page, with the page title in white.
  - The first cards overlap the bottom of the band.
  - Its height adjusts to each page automatically.
  - Once you scroll, the header becomes a solid pink bar.
- **Plum hero cards.** The dashboard, module, GRC and Application banners are dark plum (#2A1420), with pink buttons and progress rings.
- **CISA hub.** The title and section tabs sit on the band, and the exam date is a plum card.
- **Type.** Sora is used for headings and interface text. Lesson paragraphs use Inter so long reading stays easy on the eyes.
- **Buttons.** Main buttons are plum with white text, and links use a darker pink so they are readable.
- **Dark mode.** It has a matching darker band and plum surfaces.

## Note on readability
Small white text on the orange part of the band has lower contrast than accessibility guidelines recommend; this is how the original design looks. To improve it, change the two `--band` colours in the `#pro-theme` style block, for example to #E8553A → #D93A78.

## Deploy
Upload `index.html` and `service-worker.js` (plus the `cisa/` folder if it isn't already updated), then hard refresh once.

## Update: cleaner headers and dashboard motion
- **CISA Study Hub header** now matches the other pages. It has a small line above the title (exam date and plan) and the "CISA Study Hub" title. The long description and the separate exam-date card are gone.
- **Shorter page headers.** The explanatory paragraphs are hidden from the headers of the Technical, GRC, Application, Workbook, Study Log, Insights, Explore, Rosetta, Subnet and Cert pages. Module headers keep their one-line goal.
- **Dashboard header.**
  - The generic intro paragraph is replaced by a "Next up" line with a pulsing dot, once you have started.
  - The banner rises in and its contents appear one after another.
  - The progress ring and journey path draw themselves, and the stages pop in.
  - Soft pink and orange glows drift slowly behind the banner.
  - A light shine sweeps across the main button every few seconds.
  - The current stage glows gently.
- **Reduced motion.** All motion turns off automatically if your device has "reduce motion" switched on.
