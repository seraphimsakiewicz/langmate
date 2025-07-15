# 🎯 Langmate Sunday MVP - Task Tickets

## 📋 **DAY 1 - MONDAY**

### **LANG-001: Supabase Project Setup**
**Priority**: Critical | **Estimate**: 2 hours

**Tasks**:
- [ ] Create new Supabase project
- [ ] Set up environment variables in Next.js
- [ ] Install `@supabase/supabase-js` package
- [ ] Create supabase client utility file
- [ ] Test connection with basic query

**Acceptance Criteria**:
- Supabase client connects successfully
- Environment variables configured
- Basic connection test passes

---

### **LANG-002: Database Schema Setup**
**Priority**: Critical | **Estimate**: 1 hour

**Tasks**:
- [ ] Create `profiles` table in Supabase
- [ ] Add columns: `id`, `native_language`, `target_language`, `created_at`, `email`, `firstName`, `lastName`
- [ ] Set up RLS (Row Level Security) policies
- [ ] Create indexes for language columns

**SQL Schema**:
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  native_language text NOT NULL,
  target_language text NOT NULL,
  created_at timestamp DEFAULT now()
);
```

**Acceptance Criteria**:
- Table created successfully
- RLS policies allow user access to own profile
- Can insert/query test data

---

### **LANG-003: Basic Auth Pages**
**Priority**: Critical | **Estimate**: 3 hours

**Tasks**:
- [ ] Create `/signup` page with email/password form
- [ ] Create `/login` page with email/password form
- [ ] Add form validation and error handling
- [ ] Implement signup/login functions with Supabase Auth
- [ ] Add basic styling (can be minimal)

**Acceptance Criteria**:
- Users can sign up with email/password
- Users can log in with email/password
- Form validation works
- Errors are displayed to user
- Successful auth redirects appropriately

---

## 📋 **DAY 2 - TUESDAY**

### **LANG-004: Auth State Management**
**Priority**: Critical | **Estimate**: 2 hours

**Tasks**:
- [ ] Set up auth context/provider
- [ ] Handle auth state changes
- [ ] Implement logout functionality
- [ ] Add auth guards to protected routes
- [ ] Test auth persistence across browser refresh

**Acceptance Criteria**:
- Auth state persists across page refreshes
- Logout works correctly
- Protected routes redirect to login
- Auth context available throughout app

---

### **LANG-005: Language Selection Onboarding**
**Priority**: Critical | **Estimate**: 3 hours

**Tasks**:
- [ ] Create `/onboarding` page
- [ ] Add language selection dropdowns (English/Spanish only)
- [ ] Save language preferences to profiles table
- [ ] Redirect to main app after completion
- [ ] Handle case where profile already exists

**Acceptance Criteria**:
- New users see onboarding after signup
- Can select native language (English/Spanish)
- Can select target language (English/Spanish)
- Languages save to database correctly
- Redirects to main app after saving

---

### **LANG-006: Main App Layout**
**Priority**: High | **Estimate**: 2 hours

**Tasks**:
- [ ] Create main app page (`/app` or `/dashboard`)
- [ ] Add basic navigation header
- [ ] Show current user's languages
- [ ] Add logout button
- [ ] Basic responsive layout

**Acceptance Criteria**:
- Main app loads for authenticated users
- Shows user's selected languages
- Navigation works
- Logout button functions
- Looks decent on mobile

---

## 📋 **DAY 3 - WEDNESDAY**

### **LANG-007: WebSocket Online Status**
**Priority**: High | **Estimate**: 4 hours

**Tasks**:
- [ ] Update WebSocket server to track online users
- [ ] Store online users with their language preferences
- [ ] Broadcast online user count to all clients
- [ ] Handle user disconnect cleanup
- [ ] Test with multiple browser tabs

**Acceptance Criteria**:
- Online users tracked accurately
- User count updates in real-time
- Disconnects are handled properly
- Multiple users can be online simultaneously

---

### **LANG-008: Online Status UI**
**Priority**: High | **Estimate**: 2 hours

**Tasks**:
- [ ] Add online status indicator to main page
- [ ] Show count of compatible partners online
- [ ] Add "Find Language Partner" button
- [ ] Basic loading states

**Acceptance Criteria**:
- Shows "🟢 X people online" or similar
- Count updates in real-time
- Button is clearly visible
- Loading states work

---

## 📋 **DAY 4 - THURSDAY**

### **LANG-009: Language-Based Matching**
**Priority**: Critical | **Estimate**: 4 hours

**Tasks**:
- [ ] Update matching logic to use language preferences
- [ ] Match users where native/target languages complement
- [ ] Handle "no match found" scenario
- [ ] Add matching timeout (30 seconds)
- [ ] Test matching with different language combinations

**Matching Logic**:
- User A: native=English, target=Spanish
- User B: native=Spanish, target=English
- → Perfect match!

**Acceptance Criteria**:
- Users matched based on language compatibility
- "No match found" handled gracefully
- Matching doesn't hang indefinitely
- Works with multiple concurrent users

---

### **LANG-010: Matching UI States**
**Priority**: High | **Estimate**: 2 hours

**Tasks**:
- [ ] Add "Looking for partner..." loading state
- [ ] Show "No partners available" message
- [ ] Add cancel matching button
- [ ] Smooth transition to video call when matched

**Acceptance Criteria**:
- Clear feedback during matching process
- Users can cancel matching search
- Smooth UX flow from matching to video call
- Error states are user-friendly

---

## 📋 **DAY 5 - FRIDAY**

### **LANG-011: Enhanced Video Call UI**
**Priority**: Medium | **Estimate**: 3 hours

**Tasks**:
- [ ] Show partner's name and languages in video call
- [ ] Improve timer display for language switching
- [ ] Add better session controls (mute, video toggle)
- [ ] Show current language being spoken
- [ ] Add session end button

**Acceptance Criteria**:
- Partner info clearly displayed
- Language switching timer is prominent
- Session controls work reliably
- Users can end session cleanly

---

### **LANG-012: Basic Error Handling**
**Priority**: Medium | **Estimate**: 2 hours

**Tasks**:
- [ ] Add try/catch blocks to main functions
- [ ] Show user-friendly error messages
- [ ] Handle network disconnections gracefully
- [ ] Add basic logging for debugging

**Acceptance Criteria**:
- App doesn't crash on errors
- Users see helpful error messages
- Network issues handled gracefully
- Errors logged for debugging

---

## 📋 **DAY 6 - SATURDAY**

### **LANG-013: Final Polish & Testing**
**Priority**: Medium | **Estimate**: 4 hours

**Tasks**:
- [ ] Test complete user flow end-to-end
- [ ] Fix any critical bugs found
- [ ] Improve mobile responsiveness
- [ ] Add basic loading spinners
- [ ] Clean up console errors/warnings

**Acceptance Criteria**:
- Complete user flow works smoothly
- No critical bugs remain
- Works on mobile devices
- Clean console output

---

### **LANG-014: Multi-User Testing**
**Priority**: High | **Estimate**: 2 hours

**Tasks**:
- [ ] Test with 2+ users simultaneously
- [ ] Verify matching works correctly
- [ ] Test video calls between real users
- [ ] Verify language switching works
- [ ] Document any remaining issues

**Acceptance Criteria**:
- Multiple users can use app simultaneously
- Matching and video calls work reliably
- Language switching functions correctly
- Ready for demo/launch

---

## 🎯 **Definition of Done**

For each ticket:
- [ ] Code written and tested
- [ ] Basic error handling implemented
- [ ] Works on both desktop and mobile
- [ ] No console errors
- [ ] Meets acceptance criteria

## 🚀 **Sunday Success Criteria**

A user can:
1. Sign up/login
2. Select languages (EN/ES)
3. See online user count
4. Get matched with compatible partner
5. Have video call with language switching
6. End session cleanly

**Ship it!** 🚀