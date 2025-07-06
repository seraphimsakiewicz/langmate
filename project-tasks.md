ok how about this they can schedule a session every 10 minutes, but sessins are either 20,40,or 60 minutes. so no matter what theyll always have a 10 min break to take.

Absolutely. Here's your **Langmate MVP** converted into a clean, task-based Markdown project plan — ready for pasting into a GitHub Project, Notion board, or markdown file.

---

# ✅ Langmate MVP — Project Tasks

---

## Phase 0 – Scaffold

* [ ] Create a new Next.js (App Router) project
* [ ] Add Tailwind CSS and shadcn UI
* [ ] Choose and set up auth provider (Clerk, Supabase, or Firebase)
* [ ] Create `.env.example` and commit it

---

## Phase 1 – Authentication & Profile

### 🔐 Signup & Login

* [ ] Create `/signup` page with fields:

  * First name
  * Email
  * Password
* [ ] Create `/login` page with:

  * Email
  * Password
  * Google Sign-In
* [ ] Enable Google OAuth + email/password (no magic link)
* [ ] Redirect new users to `/onboarding` after first login

### 🧭 Onboarding

* [ ] Create `/onboarding` page with:

  * Native language (dropdown)
  * Target language (dropdown)
* [ ] Save user to `profiles` table with:

  * `id`, `email`, `name`, `native_lang`, `target_lang`, `created_at`

---

## Phase 2 – Scheduling System

### 📆 Booking Logic

* [ ] Write `generateSlots()` utility to return next 6 hours of time slots (starts every 10 min)
* [ ] Create `sessions` table with:

  * `id`, `user_id`, `start`, `end`, `length`, `native_lang`, `target_lang`, `room_url`, `status`

### 🧠 Booking Rules

* [ ] Enforce 10-minute cooldown after each session

  * If `new_start < last_end + 10min`: reject booking
* [ ] Block users from double-booking or overlapping slots

### 🖼️ Schedule UI

* [ ] `/schedule` page:

  * List next available start times (e.g. 10:00, 10:10, 10:20...)
  * When clicked, show 3 buttons:

    * `20 min` (ends +20 min)
    * `40 min` (ends +40 min)
    * `60 min` (ends +60 min)
  * Disable any options that violate the cooldown rule

---

## Phase 3 – Matching & Video

### 🤝 Match Logic

* [ ] Implement `findPartner()` logic:

  * Same start time and length
  * Your target = their native, and vice versa
* [ ] If partner found:

  * Create Daily/Twilio video room
  * Store `room_url`, update both sessions to `matched`
* [ ] If no partner:

  * Set session to `waiting`

### 📹 Session Page

* [ ] Create `/session/[id]` page

  * Poll until `room_url` exists
  * Show "Join Room" button
* [ ] Embed video using Daily or Twilio Prebuilt
* [ ] Display countdown clock
* [ ] Alert at halfway point: “Switch languages”
* [ ] Auto-leave / end call at end time

---

## Phase 4 – Post-Call Controls

### 🔧 User Actions

* [ ] Create tables:

  * `favorites (user_id, partner_id)`
  * `snoozes (user_id, partner_id, expires_at)`
  * `reports (user_id, partner_id, reason, created_at)`
* [ ] After session ends, show buttons:

  * ❤️ Favorite (prefer to match again)
  * 💤 Snooze (don’t match for 7 days)
  * 🚩 Report (dropdown: spam, inappropriate, etc.)

### 🌐 API

* [ ] Create API endpoints for:

  * Adding/removing favorites
  * Snoozing a partner
  * Submitting a report

---

## Deployment & Manual Moderation

* [ ] Deploy to Vercel or Netlify
* [ ] Add all env vars to project settings
* [ ] Use auth/DB dashboard for:

  * Viewing `reports`
  * Deactivating users (no admin UI yet)
* [ ] Manually verify reports for early-stage moderation

---