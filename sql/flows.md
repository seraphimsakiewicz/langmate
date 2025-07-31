# Scheduled-Based Matching Flows

All sessions are scheduled for specific time slots (e.g., 2:00 PM, 2:15 PM, 2:30 PM, 2:45 PM, etc.)

## Scenario 1: Happy Path - Successful Match

**Step 1:** User A schedules a session for 3:00 PM
```sql
INSERT INTO match_requests (user_id, native_language_id, learning_language_id, proficiency_level, availability_start, availability_end, preferred_duration_minutes)
VALUES ('user-a', 'english', 'spanish', 'intermediate', '2025-07-27 15:00:00', '2025-07-27 15:00:00', 60);
```

**Step 2:** User B wants the same time slot and gets matched
```sql
INSERT INTO match_requests (user_id, native_language_id, learning_language_id, proficiency_level, availability_start, availability_end, preferred_duration_minutes)
VALUES ('user-b', 'spanish', 'english', 'intermediate', '2025-07-27 15:00:00', '2025-07-27 15:00:00', 60);
```


<!-- do this with a trigger -->
**Step 3:** Matching algorithm auto-creates session
```sql
-- Mark both requests as matched
UPDATE match_requests SET status='matched', matched_at=now() WHERE id IN ('req-a', 'req-b');

-- Create scheduled session
INSERT INTO sessions (participant_one_id, participant_two_id, match_request_one_id, match_request_two_id, 
                     language_one_id, language_two_id, scheduled_start, scheduled_end, duration_minutes)
VALUES ('user-a', 'user-b', 'req-a', 'req-b', 'english', 'spanish', 
        '2025-07-27 15:00:00', '2025-07-27 16:00:00', 60);
```

**Step 4:** At 3:00 PM, both users join and session begins
```sql
UPDATE sessions SET status='active', actual_start=now() WHERE id='session-123';
```

## Scenario 2: No-Show - One User Doesn't Join

**What happens:** Session scheduled for 3:00 PM, User A joins but User B doesn't show by 3:02 PM

**Step 1:** Mark session as cancelled due to no-show
```sql
UPDATE sessions SET status='cancelled' WHERE id='session-123';
UPDATE match_requests SET status='no_show' WHERE id='req-b';
```

**Step 2:** Create new high-priority match request for User A
```sql
INSERT INTO match_requests (user_id, native_language_id, learning_language_id, proficiency_level, 
                           availability_start, availability_end, preferred_duration_minutes, priority)
VALUES ('user-a', 'english', 'spanish', 'intermediate', 
        '2025-07-27 15:10:00', '2025-07-27 15:10:00', 60, 1);
```

**Step 3:** User A gets priority matching for next available slot

## Scenario 3: Pre-Session Cancellation

**What happens:** Session scheduled for 3:00 PM, User B cancels at 2:55 PM

**Step 1:** User B cancels their participation
```sql
UPDATE sessions SET status='cancelled' WHERE id='session-123';
UPDATE match_requests SET status='cancelled' WHERE id='req-b';
```

**Step 2:** Auto-create new match request for User A with higher priority
```sql
INSERT INTO match_requests (user_id, native_language_id, learning_language_id, proficiency_level, 
                           availability_start, availability_end, preferred_duration_minutes, priority)
VALUES ('user-a', 'english', 'spanish', 'intermediate', 
        '2025-07-27 15:00:00', '2025-07-27 15:00:00', 60, 1);
```

**Step 3:** System tries to find User A a replacement for the same 3:00 PM slot

## Scenario 4: User Reschedules Before Match

**What happens:** User A scheduled for 3:00 PM but wants to change to 4:00 PM before getting matched

**Step 1:** Cancel original request
```sql
UPDATE match_requests SET status='cancelled' WHERE id='req-a' AND status='waiting';
```

**Step 2:** Create new request for different time
```sql
INSERT INTO match_requests (user_id, native_language_id, learning_language_id, proficiency_level, 
                           availability_start, availability_end, preferred_duration_minutes)
VALUES ('user-a', 'english', 'spanish', 'intermediate', 
        '2025-07-27 16:00:00', '2025-07-27 16:00:00', 60);
```

## Key Points:

- **Priority system**: Users who got cancelled on get `priority=1` for faster rematching
- **Time slots**: All sessions are for specific times (e.g., every 10 minutes)
- **Match requests cleanup**: Expired/cancelled requests get marked, not deleted
- **Session lifecycle**: `scheduled` → `active` → `completed`/`cancelled`