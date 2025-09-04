import { Session } from '@/types/calendar';

const generateDynamicSessions = (): Session[] => {
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now);
  const tomorrow = new Date(now);
  
  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const addMinutes = (date: Date, minutes: number) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  };

  // Helper to round time to nearest 30-minute slot (00 or 30)
  const getNext30MinSlot = (baseTime: Date, offsetMinutes: number) => {
    const target = new Date(baseTime);
    target.setMinutes(target.getMinutes() + offsetMinutes);
    
    const minutes = target.getMinutes();
    if (minutes < 30) {
      target.setMinutes(0, 0, 0);
    } else {
      target.setMinutes(30, 0, 0);
    }
    
    return target;
  };

  const sessions: Session[] = [];

  // Yesterday's session
  const yesterdaySession = new Date(yesterday);
  yesterdaySession.setHours(14, 30, 0, 0);
  sessions.push({
    id: 'yesterday-1',
    title: 'Session with Bryan C.',
    startTime: formatTime(yesterdaySession),
    endTime: formatTime(addMinutes(yesterdaySession, 25)),
    date: formatDate(yesterday),
    participant: 'Bryan C.',
    status: 'booked',
  });

  // Today's past session (find a past 30-min slot)
  const todayPast = getNext30MinSlot(now, -120);
  sessions.push({
    id: 'today-past-1',
    title: 'Session with Mubarak',
    startTime: formatTime(todayPast),
    endTime: formatTime(addMinutes(todayPast, 25)),
    date: formatDate(today),
    participant: 'Mubarak',
    status: 'booked',
  });

  // Today's upcoming session (30 minutes from now)
  const todayUpcoming = getNext30MinSlot(now, 30);
  sessions.push({
    id: 'today-upcoming-1',
    title: 'Session with Andrea H.',
    startTime: formatTime(todayUpcoming),
    endTime: formatTime(addMinutes(todayUpcoming, 25)),
    date: formatDate(today),
    participant: 'Andrea H.',
    status: 'booked',
  });

  // Today's second upcoming session (1 hour from now)
  const todayUpcoming2 = getNext30MinSlot(now, 60);
  sessions.push({
    id: 'today-upcoming-2',
    title: 'Session with Jason Lee',
    startTime: formatTime(todayUpcoming2),
    endTime: formatTime(addMinutes(todayUpcoming2, 25)),
    date: formatDate(today),
    participant: 'Jason Lee The lONGEST NAME OF ALL TIME HALLEJUAH',
    status: 'booked',
  });

  // Today's late night session (11:30 PM)
  const todayLate = new Date(today);
  todayLate.setHours(23, 30, 0, 0);
  sessions.push({
    id: 'today-late-1',
    title: 'Session with Mike T.',
    startTime: formatTime(todayLate),
    endTime: formatTime(addMinutes(todayLate, 25)),
    date: formatDate(today),
    participant: 'Mike T.',
    status: 'booked',
  });

  // Tomorrow's session (30 minutes from now, but tomorrow)
  const tomorrowUpcoming = getNext30MinSlot(now, 30);
  const tomorrowSession = new Date(tomorrow);
  tomorrowSession.setHours(tomorrowUpcoming.getHours(), tomorrowUpcoming.getMinutes(), 0, 0);
  sessions.push({
    id: 'tomorrow-1',
    title: 'Session with Sarah M.',
    startTime: formatTime(tomorrowSession),
    endTime: formatTime(addMinutes(tomorrowSession, 25)),
    date: formatDate(tomorrow),
    participant: 'Sarah M.',
    status: 'booked',
  });

  // Tomorrow's second session (fixed time)
  const tomorrowFixed = new Date(tomorrow);
  tomorrowFixed.setHours(15, 0, 0, 0);
  sessions.push({
    id: 'tomorrow-2',
    title: 'Session with Emily R.',
    startTime: formatTime(tomorrowFixed),
    endTime: formatTime(addMinutes(tomorrowFixed, 25)),
    date: formatDate(tomorrow),
    participant: 'Emily R.',
    status: 'booked',
  });

  return sessions;
};

export const dummySessions: Session[] = generateDynamicSessions();