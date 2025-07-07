# 🎯 Langmate MVP — Simple Task List

> **Current Status**: Basic matching + video calls working. Need auth, scheduling UI, and polish.

---

## 🚀 **MVP Core Features**

### **MVP-001: User Authentication**
**Priority**: High | **Estimate**: 1 day

**What we need**:
- [ ] Simple signup/login page (email + password)
- [ ] Google login button
- [ ] Basic user profiles stored somewhere
- [ ] Redirect to onboarding for new users

**UI to build**:
- `/signup` page - simple form
- `/login` page - simple form + Google button
- Basic navigation with login/logout

---

### **MVP-002: User Onboarding** 
**Priority**: High | **Estimate**: 4 hours

**What we need**:
- [ ] Welcome screen for new users
- [ ] Language selection (native + target)
- [ ] Save to user profile
- [ ] Redirect to main app

**UI to build**:
- `/onboarding` page with 2-step form
- Language dropdowns (start with EN/ES)
- Nice welcome message

---

### **MVP-003: Scheduling Interface**
**Priority**: High | **Estimate**: 1 day

**What we need**:
- [ ] Replace instant matching with time slots
- [ ] Show next 6 hours of available times
- [ ] Let users pick 20/40/60 min sessions
- [ ] Simple booking confirmation

**UI to build**:
- `/schedule` page with time grid
- Time slot buttons (10:00, 10:10, 10:20...)
- Duration selector (20/40/60 min buttons)
- Booking confirmation popup

---

### **MVP-004: Main Dashboard**
**Priority**: Medium | **Estimate**: 6 hours

**What we need**:
- [ ] Landing page after login
- [ ] Show upcoming sessions
- [ ] Quick "Schedule Session" button
- [ ] Simple navigation menu

**UI to build**:
- `/dashboard` page layout
- Session cards showing upcoming bookings
- Navigation header/sidebar
- Quick action buttons

---

### **MVP-005: Enhanced Session UI**
**Priority**: Medium | **Estimate**: 4 hours

**What we need**:
- [ ] Better timer display
- [ ] Clear language switching indicator
- [ ] Improved session controls
- [ ] Partner info display

**UI to build**:
- Better timer layout in session page
- Language switch notification
- Cleaner video call interface
- Partner name/language display

---

## 🎨 **UI Polish & UX**

### **UI-001: App Layout & Navigation**
**Priority**: Medium | **Estimate**: 4 hours

**What we need**:
- [ ] Consistent header/navigation
- [ ] Logo and branding
- [ ] Mobile-friendly layout
- [ ] Loading states

**UI to build**:
- App layout component
- Navigation menu
- Mobile responsive design
- Loading spinners/states

---

### **UI-002: Session Booking Flow**
**Priority**: High | **Estimate**: 4 hours

**What we need**:
- [ ] Smooth booking experience
- [ ] Clear availability display
- [ ] Booking confirmation
- [ ] Error handling

**UI to build**:
- Time slot selection interface
- Duration picker
- Booking confirmation modal
- "No slots available" states

---

### **UI-003: Session Experience**
**Priority**: Medium | **Estimate**: 3 hours

**What we need**:
- [ ] Pre-session waiting room
- [ ] Clear session progress
- [ ] Language switch notifications
- [ ] Session end handling

**UI to build**:
- Waiting room interface
- Progress indicators
- Language switch alerts
- Session completion screen

---

## 🔧 **Technical Essentials**

### **TECH-001: WebSocket Server**
**Priority**: High | **Estimate**: 4 hours

**What we need**:
- [ ] Separate WebSocket server from Next.js
- [ ] Handle scheduling-based matching
- [ ] Basic session persistence

**Simple approach**:
- Move server.js to separate service
- Add basic database or file storage
- Update matching logic for scheduling

---

### **TECH-002: Simple Database**
**Priority**: High | **Estimate**: 3 hours

**What we need**:
- [ ] Store users and sessions
- [ ] Basic auth integration
- [ ] Session booking data

**Simple approach**:
- Use Supabase or similar
- Basic tables: users, sessions, bookings
- Connect to auth and booking system

---

### **TECH-003: Basic Error Handling**
**Priority**: Low | **Estimate**: 2 hours

**What we need**:
- [ ] Handle common errors gracefully
- [ ] Show user-friendly messages
- [ ] Basic logging

**Simple approach**:
- Try/catch blocks
- Toast notifications for errors
- Console logging for debugging

---

## 📋 **MVP Checklist**

### **Week 1: Core Features**
- [ ] MVP-001: User Authentication
- [ ] MVP-002: User Onboarding
- [ ] TECH-001: WebSocket Server
- [ ] TECH-002: Simple Database

### **Week 2: Scheduling & UI**
- [ ] MVP-003: Scheduling Interface
- [ ] UI-001: App Layout & Navigation
- [ ] UI-002: Session Booking Flow
- [ ] MVP-004: Main Dashboard

### **Week 3: Polish & Launch**
- [ ] MVP-005: Enhanced Session UI
- [ ] UI-003: Session Experience
- [ ] TECH-003: Basic Error Handling
- [ ] Deploy and test

---

## 🎯 **MVP Definition**

**A user can:**
1. Sign up/login with email or Google
2. Set their native and target languages
3. Schedule a language exchange session
4. Get matched with someone who speaks their target language
5. Have a video call with automatic language switching
6. See their upcoming sessions

**That's it!** Everything else is post-MVP.

---

## 🚫 **NOT in MVP**

- Partner favorites/blocking
- Session ratings/feedback
- Advanced scheduling rules
- User profiles beyond basic info
- Mobile app
- Multiple languages beyond EN/ES
- Analytics or reporting
- Advanced matching algorithms
- Payment system
- Admin panel

Keep it simple and ship it! 🚀