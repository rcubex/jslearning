# V12: Tahoe Liquid Glass (whole app, light only)

The whole signed-in app now uses the Tahoe Liquid Glass design, inspired by the newest macOS. Content, progress and every feature are unchanged, and the login page is untouched.

- **Wallpaper.** A bright aqua, blue and lavender wallpaper stays fixed behind every page.
- **Sidebar.** A floating glass sidebar with rounded corners, the macOS window dots, blue icons and Apple's system font. The current page is shown as a raised glass pill.
- **Liquid glass surfaces.** Very clear glass with bright top edges, strong blur and large rounded corners. This covers cards, banners, tables, lessons, quiz options, inputs, the CISA hub, mock exams and the Mistakes notebook.
- **Banners.** The dashboard, module, GRC and Application banners are light glass.
- **Buttons and tabs.** Main buttons are glossy blue pills; secondary buttons and tabs are glass pills; progress bars run sky-blue to blue.
- **Light only.** There is no dark mode and no Theme button; the app always opens light.
- **Phones.** A frosted top bar with the ☰ menu.

## Deploy
Upload `index.html` and `service-worker.js` (and `cisa/` if it isn't already updated), then hard refresh once (Ctrl+Shift+R).

## Update: tidier layout
The Tahoe theme is the same; only the arrangement of content changed.
- **One spacing system.** Gaps between cards are the same everywhere (24px; 16px on phones), all cards share one corner size and one padding, and page titles and section headings use the same spacing on every page.
- **Background.** The coloured band that cut across the page partway down is gone, leaving only the smooth wallpaper.
- **Dashboard academies.** They are arranged as two large cards over three equal cards, so there is no lone card left on its own row. Text inside every card lines up, and the links sit at the bottom.
- **Dashboard banner.** The right-hand column is wider, so "Technical Academy" and the CISA exam date no longer wrap awkwardly.
- **CISA hub.**
  - The domain names and their percentages line up in clean columns.
  - Buttons sit at the bottom of each card.
  - The month steps and notes have matching glass styling.
- **No boxes inside boxes.** Tables and lists inside a card are plain, with fine divider lines.
- **Technical Academy.** The level headers are an even three-part row: number, title and progress.
- **Module cards.** They have a consistent internal layout with descriptions limited to two lines.

## Update: focus reader for module pages
Technical, GRC and Application module pages no longer squeeze the lesson text into a narrow middle column.
- **Wide reading column.** One centred column, about 860px wide.
- **Bigger, easier text.** Lesson text is 17.5px with generous line spacing (1.85), darker for contrast, with more space between paragraphs.
- **Floating chapter bar.** The "In this module" list is now a slim bar that stays at the top while you read. Tap a chapter to jump to it, and swipe it sideways on a phone.
- **Lessons as pages.** Each lesson is its own spacious page with a "Lesson 3.1 · 2 min read" tag and a large title. The timeline dots and connecting line are gone.
- **Roomier content blocks.** Key points, steps, tips, code examples, deep-dive sections, takeaways, quizzes and notes all have more padding and spacing.
- **Side panels moved.** Key terms, official reading and quick-log now sit in a row below the lesson content instead of crowding its side.

## Update: "Spacious Editorial" dashboards
The Dashboard and the CISA Overview were rebuilt with large type, few boxes and generous space. The Tahoe glass theme is unchanged.
- **Dashboard.**
  - A large greeting, then one main card with your next module, a progress bar, "Continue lesson" and a large Technical progress ring.
  - Four large numbers sit on the background without boxes: hours this week, day streak, quiz accuracy and days to the CISA exam (with any mistakes due).
  - "Your academies" are four equal cards in a 2×2 grid, with the percentage on the right.
  - Below them come the learning path, the weekly chart, cloud mastery and achievements.
- **CISA hub header.** Your exam countdown ("75 days") sits in large type on the right of the title, with the Normal/Relaxed plan switch under it.
- **CISA overview.**
  - The main card shows your next task with Read topic, Log a session and Review mistakes buttons. Beside it are four large numbers: topics covered, hours logged, readiness and mistakes due.
  - "Readiness by domain" is a clean list showing each domain's exam weight.
  - "Coming up" lists your next five planned sessions.

## Update: new login, quote of the day, 10-minute timeout
- **Lock-screen login.** The unicorn login page is replaced by a macOS-style lock screen: a live clock and date, a round "JS" avatar and a glass sign-in card. It has a Show/Hide password button, and Firebase sign-in works exactly as before.
- **Quote of the day.** An Apple-style notification slides in at the top right of the login page. It shows a different quote each day, rotating through 31, and disappears after 12 seconds or when you tap ×.
- **10-minute timeout.**
  - After 10 minutes with no mouse, keyboard, scroll or touch activity, the app saves your progress, signs you out, and shows the login page with "You were signed out after 10 minutes of inactivity."
  - The timer is shared across tabs, so working in one tab keeps the others signed in.
  - Reopening the site after more than 10 minutes away also asks you to sign in again.

## Update — Misty Forest login and Apple-style planner sheets
- **Login:** the Misty Forest wallpaper (option 14), matching the mockup: pine layers, the clock at the top, the glass sign-in card with the logo on the left, and no footer.
- **Quote notification:** slides in from the right like a macOS banner. It pauses while you hover over it, and a close button appears on hover. There are 31 study and growth quotes, one per day.
- **CISA Study planner:**
  - The tab now shows a minimal summary: plan name, dates, weekly hours, a timeline bar, four figures and the next four sessions.
  - **View full plan** opens an Apple-style sheet with the whole plan, week by week. You can tick topics as done there.
  - **Configure plan** opens a second sheet on top. It has plan type, dates, weekly hours and topic customisation (add, edit, reorder, include or exclude). **Save plan** recalculates the schedule and closes the sheet.
  - Sheets have a blurred backdrop and a spring animation, and close on Esc, a backdrop click or ×.
- Service worker cache: `p2c-theory-cisa-v23-forest`.

## Update — Tropical Beach login
- The login wallpaper is now Tropical Beach (palms, turquoise sea, sand, with gently moving surf).
- The sign-in card is smaller (340 px) and centred, with the clock above it.
- The quote of the day shows once per day: only the first time the login page opens that day. The quote changes every day.
- Removed the "How these statistics work" panel from Study Insights.
- Service worker cache: `p2c-theory-cisa-v24-beach`.

## Update — Rotating login wallpapers
- The login wallpaper changes every 30 minutes, at :00 and :30. It cycles through 25 scenes, starting with Tropical Beach.
- Each change crossfades smoothly. On dark scenes (Twilight Lake, Northern Lights) the clock text turns white.
- The wallpapers live in the new file `login-walls.js`, which is cached offline by the service worker.
- Sign-in card proportions adjusted to 344 × 308 px (about 1.1:1), with more even padding.
- Service worker cache: `p2c-theory-cisa-v25-walls`.
