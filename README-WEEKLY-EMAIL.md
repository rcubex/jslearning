# Weekly report + 3-day study nudges — setup (one time, ~10 minutes)

Every Monday at 08:00 Dubai time, GitHub runs `scripts/weekly-report.mjs`. It reads each learner's last week
(Mon–Sun) from Firestore and sends them a weekly report through **EmailJS**, using the same JS Learning template
as the admin Notify button. Blocked learners and learners who never signed in are skipped.

**Daily 3-day check (18:00 Dubai):** looks at the last 3 full days for each learner.
- No study at all for 3 days → "What happened?" email.
- Studied, but under 15 minutes a day on average → "Dude, you're studying less" email.
- A learner gets at most one nudge every 3 days. Each nudge is noted in the admin audit log.

## 1. EmailJS (you already have the template)
- **Account → Security**: turn ON **"Allow EmailJS API for non-browser applications"**
  (GitHub sends from a server, not a browser — without this EmailJS refuses with a 403).
- **Account → General**: copy the **Public Key** and the **Private Key** (create one if empty).
- **Email Services**: copy the **Service ID**. **Email Templates → your template → Settings**: copy the **Template ID**.
- The template must have To Email `{{to_email}}` and Subject `{{subject}}`.

## 2. Firebase service-account key (lets GitHub read the study data)
Firebase console → ⚙ Project settings → **Service accounts** → **Generate new private key** → a .json file downloads.
Keep it private. Do NOT upload it to the repo.

## 3. GitHub secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | the whole content of the .json file from step 2 |
| `EMAILJS_SERVICE_ID` | e.g. service_abc123 |
| `EMAILJS_TEMPLATE_ID` | e.g. template_xyz789 |
| `EMAILJS_PUBLIC_KEY` | Public Key |
| `EMAILJS_PRIVATE_KEY` | Private Key |
| `ADMIN_EMAIL` | (optional) your email — you get a "who was sent" summary |

## 4. Test it
Repo → **Actions → Weekly status email → Run workflow** → choose **weekly** or **nudge** → type your own email in "test_to" → Run.
Every learner's report arrives in your inbox. Leave "test_to" empty to send for real.

After that it runs by itself every Monday. Each send is noted in the learner's audit log in the admin portal.
EmailJS free plan = 200 emails/month — plenty (about 3 per week here).
GitHub may start scheduled runs a few minutes late, and pauses schedules after 60 days without repo activity
(pressing "Run workflow" re-enables it).
