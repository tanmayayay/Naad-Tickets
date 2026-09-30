/* NAAD Tickets — demo booking store (browser localStorage).
   Real payments, inventory holds and fraud checks arrive with the backend phase. */

const KEY = 'naad-tickets-bookings-v1';
const CITY_KEY = 'naad-tickets-city';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function makeBookingId() {
  let s = '';
  for (let i = 0; i < 6; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return 'NDT-' + s;
}

export function saveBooking(b) {
  const list = read();
  list.unshift(b);
  write(list);
  return b;
}

export function getBookings() {
  return read();
}

export function getBooking(id) {
  return read().find((b) => b.id === id);
}

export function cancelBooking(id) {
  write(read().filter((b) => b.id !== id));
}

export function getCity() {
  return localStorage.getItem(CITY_KEY) || 'Mumbai';
}

export function setCity(c) {
  localStorage.setItem(CITY_KEY, c);
}

const PENDING_KEY = 'naad-tickets-pending-v1';
export function setPending(p) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
}
export function getPending() {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null');
  } catch {
    return null;
  }
}
export function clearPending() {
  sessionStorage.removeItem(PENDING_KEY);
}

const NOTIFY_KEY = 'naad-tickets-notify-v1';
export function isNotified(eventId) {
  try {
    return (JSON.parse(localStorage.getItem(NOTIFY_KEY) || '[]') || []).includes(eventId);
  } catch {
    return false;
  }
}
export function setNotified(eventId) {
  const list = JSON.parse(localStorage.getItem(NOTIFY_KEY) || '[]');
  if (!list.includes(eventId)) {
    list.push(eventId);
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
  }
}
