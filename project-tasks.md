## current TODOS

- ~~Fix Modal~~ 
  - ~~book session to be exact~~
  - ~~also show sep 5, 2025 for date for example instead of 9/5/2025.~~
- ~~Fix Calendar Date Picker and BookingModal bug, not showing current date again when you reopen the daypicker.~~
- add prettier
- markup some designs with stitch for sessions/people sections.
- Fix the hover states for buttons/navigation items

# Phase 0 Tasks - Language Exchange Matchmaking MVP

## Core User Flow Goals:
1. Multi-language signup (native/target languages)
2. Simple session matching via websocket
3. Session page with split timers per language
4. In-session favorites/reporting
5. User settings for language management

---

## 🏗️ **Database & Schema**

### ✅ **Completed:**
- [x] DBML schema design (`dmbl-schema.sql`)
- [x] PostgreSQL schema conversion (`langmate-schema.sql`)
- [x] All tables defined: users, languages, user_languages, sessions, user_favorites, user_reports,
  user_snoozes

### 🔲 **Setup Tasks:**
- [x] Apply schema to Supabase database
- [x] Seed languages table with common languages (en, es)
- [x] Define RLS policies
- [ ] Execute RLS policies for all tables
- [ ] Create triggers / database functions for matchmaking queries

---

## 🔐 **Authentication & User Management**

### ✅ **Completed:**
- [x] Supabase auth integration
- [x] Login/signup forms with auth-form.tsx
- [x] Auth actions and middleware
- [x] Protected routes setup

### 🔲 **Enhancement Tasks:**
- [ ] **Multi-language signup flow:**
  - [ ] Add language selection to signup form
  - [ ] Create native language selection (multiple choice)
  - [ ] Create target language selection (multiple choice)
  - [ ] Ask: **"Are you able to hold a basic 5-minute conversation in your target language?"** 
  - [ ] Add proficiency level selection
  > *“How well do you speak your **target language**?”*
  * 🟢 **Fluent** “I can speak and discuss complex topics with ease.”
  * 🟡 **Intermediate** “I can talk about everyday things with some mistakes. I’m still working on
    fluency.”
  * 🟢 **Conversational** “I can hold a basic conversation about familiar topics. I don’t need to
    translate every word.”
  * 🟠 **Beginner** *(blocked in MVP)* “I know some words and phrases but can’t hold a conversation
    yet.” 👉 Show message: *“LangMate is currently only for users who are at least conversational.”*
  - [ ] Save selections to user_languages table
- [ ] **Profile completion flow:**
  - [ ] Redirect new users to complete profile
  - [ ] Add timezone, bio fields
  - [ ] Mark profile as complete in user flow

---

## 🔌 **WebSocket & Matchmaking**

### ✅ **Completed:**
- [x] Basic websocket server (ws-server/server.js)
- [x] Simple in-memory matchmaking logic

### 🔲 **Integration Tasks:**
- [] Daily.co to Agora integration for video rooms
- [ ] **Re-enable frontend socket connection:**
  - [ ] Uncomment and fix socket.js integration
  - [ ] Connect frontend to ws-server
  - [ ] Add proper error handling
- [ ] **Database-backed matchmaking:**
  - [ ] Replace in-memory storage with Supabase queries
  - [ ] Query user_languages for matching
  - [ ] Store sessions in database instead of memory
  - [ ] Add user authentication to websocket

---

## 🎯 **Session Matching UI**

### ✅ **Completed:**
- [x] Basic session page template

### 🔲 **Implementation Tasks:**
- [ ] **Home page session launcher:**
  - [ ] Create "Start Session" modal/component
  - [ ] Language selection for this session (from user's languages)
  - [ ] Duration selection (25/50 minutes, moving to a simpler timeslot & durations options since
    makes sense to offer less options to the user to concentrate users to book in only 4 available
    session slots an hour instead of 6, but maybe this will even change to only start of hour and
    middle of the hour even...)
  - [ ] "Finding match..." loading state
- [ ] **Matchmaking flow:**
  - [ ] Connect to websocket for real-time matching
  - [ ] Show searching status with loader
  - [ ] Handle match found → redirect to session
  - [ ] Handle no match found / timeout scenarios
  - [ ] Add "cancel search" functionality

---

## 🎥 **Session Page Enhancement**

### ✅ **Completed:**
- [x] Split timer functionality (hardcoded en/es)
- [x] Session state management
- [x] Session end sound

### 🔲 **Dynamic Features:**
- [] Daily to Agora video integration
- [ ] **Dynamic language display:**
  - [ ] Show actual session languages (not hardcoded)
  - [ ] Display language names from database
  - [ ] Update timer labels based on session languages
- [ ] **Partner information:**
  - [ ] Display real partner name and info
  - [ ] Show partner's avatar/profile
  - [ ] Add partner's language proficiency context
- [ ] **In-session actions:**
  - [ ] Add "Favorite Partner" button
  - [ ] Add "Report Partner" button with reason selection
  - [ ] Implement end session early functionality
- [ ] **Session persistence:**
  - [ ] Save session data to database
  - [ ] Update session status (active → completed)
  - [ ] Track actual time spent per language

---

## ⚙️ **User Settings Dashboard**

### ✅ **Completed:**
- [x] Basic account page structure

### 🔲 **Settings Implementation:**
- [ ] **Language management:**
  - [ ] Display user's current languages
  - [ ] Add/remove native languages
  - [ ] Add/remove target languages
  - [ ] Update proficiency levels
- [ ] **Profile management:**
  - [ ] Update username, full_name, bio
  - [ ] Timezone selection
  - [ ] Avatar upload/management
  - [ ] Email/password changes (if not Google auth)
- [ ] **Session preferences:**
  - [ ] Default session duration
  - [ ] Notification preferences

---

## 🎨 **UI/UX Polish**

### 🔲 **Essential UI Tasks:**
- [ ] **Landing page improvements:**
  - [ ] Show how the app works (language exchange explanation)
  - [ ] Add FAQ section
  - [ ] Better call-to-action for signup
- [ ] **Session end experience:**
  - [ ] Confetti animation on session completion
  - [ ] Session summary (time spent per language)
  - [ ] "Find Another Partner" quick action
  - [ ] Rate the session (optional)
- [ ] **Loading states:**
  - [ ] Better matching UI with progress indicators
  - [ ] Session loading states
  - [ ] Form submission loading states

---

## 🐛 **Bug Fixes & Integration**

### 🔲 **Critical Fixes:**
- [ ] **Schema alignment:**
  - [ ] Remove references to legacy "profiles" table
  - [ ] Update account-form.tsx to use "users" table
  - [ ] Align all components with new schema
- [ ] **Socket connection:**
  - [ ] Debug and fix websocket connection issues
  - [ ] Add proper error handling and reconnection
  - [ ] Test cross-browser compatibility
- [ ] **Auth flow:**
  - [ ] Fix any auth redirect issues
  - [ ] Test Google OAuth integration
  - [ ] Verify protected route behavior

---

## 🧪 **Testing & Validation**

### 🔲 **Testing Tasks:**
- [ ] **End-to-end user flow:**
  - [ ] Signup → language selection → matching → session → completion
  - [ ] Test with multiple language combinations
  - [ ] Verify database persistence
- [ ] **Edge cases:**
  - [ ] No match found scenarios
  - [ ] Connection drops during session
  - [ ] Partner leaves mid-session -> report unless user 
  - [ ] Simultaneous matching requests 

---

## 📋 **Launch Checklist**

### 🔲 **Pre-launch:**
- [ ] Database migrations applied to production
- [ ] Environment variables configured
- [ ] Basic analytics/error tracking setup
- [ ] Terms of service / privacy policy (basic)
- [ ] Test deployment pipeline

### 🔲 **Soft Launch:**
- [ ] Deploy to staging for internal testing
- [ ] Test with 4-6 real users
- [ ] Fix critical bugs found in testing
- [ ] Performance optimization if needed
- [ ] Deploy to production

---

## Future Phases Preview:
- **Phase 1:** Scheduled sessions with calendar integration
- **Phase 2:** Advanced matching with preferences and compatibility
- **Phase 3:** Community features, interest groups, and gamification