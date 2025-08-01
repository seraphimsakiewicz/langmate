  ## Session matchmaking flows
  
  1. Happy path: Both show up, have session
  2. Pre-cancellation: One cancels before start → notify other person to book 3:30 if they show up
     and see their session is gone, but attempt to rebook them up till the start time.
  3. No-show: One shows up, other doesn't → auto-cancel after 5 min, if start time is 3:00, then
     self destruct 3:05, aplogize to waiting user and prompt to book @ next slot such as 3:30

