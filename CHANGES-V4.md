# Packet to Cloud: V4 visual update

Only `index.html` and `service-worker.js` changed. Content files, Firebase rules and saved progress are untouched, and lesson and entry IDs are unchanged.

## What changed

- **Navigation:** a sidebar grouped into Learn, Track and Tools, with icons. On phones it becomes a menu button that opens a full-screen menu.
- **Theme switch:** a button in the sidebar cycles Auto, Light and Dark. The choice is saved per device.
- **Dashboard:** a redesigned header with your name and progress, five summary tiles, cards for all three academies (Technical, GRC and My Workbook), a weekly chart that includes workbook sessions, cloud mastery, a "jump back in" list and achievements.
- **Lesson reading:**
  - A reading progress bar and better text spacing.
  - Key points shown in boxes, numbered step cards, and dark code panels.
  - Tips and warnings with icons.
  - The three generic "mental model / scenario / design reasoning" paragraphs now sit in a collapsible "Think it through" panel.
  - The "Deep understanding" box no longer repeats paragraphs already shown in the lesson (376 of 402 were duplicates).
  - Bookmark sits beside "Mark as learned".
- **My Workbook:**
  - Study history is now a table: date, course and topic, source, time, notes, and actions.
  - Search, filter by source, sort by date or time, "More" to expand notes, and a totals row.
  - New entries are highlighted.
  - On phones, the table stacks into cards.
  - The add form folds away once you have entries.
- **Study Log:** shown as a table with totals.
- **Fixes:**
  - The service worker listed `galaxy-cockpit.png`, which doesn't exist, so offline caching never installed. It's removed, and the cache version is bumped so browsers pick up the new `index.html`.
  - Study Insights was counting completed technical lessons from a field that doesn't exist. It now shows the real number.
  - The workbook date now defaults to your local date instead of the UTC date.

## Before you deploy

1. Copy your real `firebaseConfig` and `ALLOWED_USER_UIDS` from your live `index.html` into this one. This file still has placeholders.
2. Upload `index.html` and `service-worker.js` together.
3. Hard refresh once (Ctrl+Shift+R) so the new service worker takes over.

# Round 1: content to the 10/10 standard

- **Technical Academy is now 34 modules, 243 lessons and 201 questions** (up from 22, 134 and 110).
  - 12 new modules: Physical Layer & Wi-Fi, DNS in Depth, TLS/PKI, IPv6 in Depth, Advanced Routing & Overlays, Serverless & PaaS Networking, Cloud Network Performance, Global Traffic/Edge/DDoS, Network Automation, Observability & Operations, SASE/SD-WAN/ZTNA, and Architecture Case Studies.
  - A real-world scenario in every module, plus deep-dive lessons.
- **The generic text is gone.** The repeated "mental model / scenario / design reasoning" paragraphs and three-step concept maps have been removed. Each module now opens with a real, clickable "big picture" diagram for its topic.
- **Glossary**: 407 terms with definitions, an A–Z filter and search. Key terms inside each module are clickable and show their meaning.
- **GRC Academy**: every lesson rewritten in depth, plus a scenario, key takeaways, a 5-question checkpoint and official reading for each of the 10 modules. Quiz answers are saved to your account.
- **Chapters**: regenerated for all 34 modules.
- **Saved progress**: the original IDs are unchanged and new items are added after the existing ones. This was checked automatically, with 0 mismatches.

# V5: "Aurora" theme

- **New look**: soft lavender backgrounds with gentle colour glows, a floating frosted-glass sidebar, and violet-to-pink gradient banners and buttons that match the unicorn login. It also has rounded cards, friendlier text (Plus Jakarta Sans), and a matching dark mode.
- **Login page**: unchanged.
- **Fixed**: the My Workbook page had stopped loading in the Round 1 build. Every page and the main actions were tested after the fix.
