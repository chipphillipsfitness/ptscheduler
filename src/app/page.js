"use client";
import { useState, useEffect, useCallback } from "react";

// ===================== DATA =====================
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TRAINING_TYPES = ["SS (lift, core)", "Sprint (lift, core)", "Aerobic", "Vo2 Max (lift, core)", "Aerobic"];

const TIME_SLOTS_FULL = ["5:30 AM","6:30 AM","7:30 AM","8:30 AM","9:30 AM","10:30 AM","11:30 AM","12:30 PM","1:30 PM","2:30 PM","3:30 PM","4:30 PM","5:30 PM","6:30 PM"];
const TIME_SLOTS_SHORT = ["5:30 AM","6:30 AM","7:30 AM","8:30 AM","9:30 AM","10:30 AM","11:30 AM","12:30 PM","1:30 PM","2:30 PM","3:30 PM","4:30 PM","5:30 PM","6:30 PM"];

const DAY_SLOTS = { Monday: TIME_SLOTS_FULL, Tuesday: TIME_SLOTS_FULL, Wednesday: TIME_SLOTS_FULL, Thursday: TIME_SLOTS_SHORT, Friday: TIME_SLOTS_SHORT };
const ALL_TIMES = TIME_SLOTS_FULL;

const CLIENTS = [
  { name: "Greg Pierce", type: "fixed", sessions: 2, phone: "405-412-6104", used: 10, purchased: 30 },
  { name: "Kirksey Taylor", type: "fixed", sessions: 1, phone: "662-871-8151", used: 10, purchased: 30 },
  { name: "Nate Garber", type: "fixed", sessions: 2, phone: "404-925-9018", used: 10, purchased: 30 },
  { name: "Jack Palms", type: "fixed", sessions: 2, phone: "214-354-1468", used: 10, purchased: 30 },
  { name: "David Spika", type: "fixed", sessions: 1, phone: "214-208-4260", used: 10, purchased: 30 },
  { name: "Paulo", type: "fixed", sessions: 2, phone: "214-274-3799", used: 10, purchased: 30 },
  { name: "Ana Ambrosi", type: "fixed", sessions: 1, phone: "214-551-7583", used: 10, purchased: 30 },
  { name: "Marnie", type: "fixed", sessions: 2, phone: "214-991-5263", used: 10, purchased: 30 },
  { name: "Rachael & Lindsay", type: "fixed", sessions: 2, phone: "214-886-8343", phone2: "214-707-3614", used: 10, purchased: 30 },
  { name: "Rick", type: "fixed", sessions: 2, duration: 25, phone: "214-914-7546", used: 10, purchased: 30 },
  { name: "Melanie Paul", type: "fixed", sessions: 1, phone: "408-218-6104", used: 10, purchased: 30 },
  { name: "Ryan Young", type: "flex", sessions: 2, phone: "817-600-7450", used: 10, purchased: 30 },
  { name: "Ryan Culpepper", type: "fixed", sessions: 1, phone: "405-833-8967", used: 10, purchased: 30 },
  { name: "Andrew Welker", type: "flex", sessions: 3, phone: "469-396-7921", used: 10, purchased: 30 },
  { name: "Madison Palms", type: "flex", sessions: 2, phone: "214-704-5090", used: 10, purchased: 30 },
  { name: "Candy Streit", type: "fixed", sessions: 2, phone: "214-803-9592", used: 10, purchased: 30 },
  { name: "Aric McCumber", type: "flex", sessions: 2, phone: "580-485-0085", used: 10, purchased: 30 },
  { name: "Kasey Moore", type: "fixed", sessions: 1, phone: "361-522-8280", used: 10, purchased: 30 },
  { name: "Patti", type: "fixed", sessions: 2, phone: "832-259-2950", used: 10, purchased: 30 },
  { name: "Kate McCumber", type: "flex", sessions: 2, phone: "918-760-9426", used: 10, purchased: 30 },
  { name: "Jacque", type: "flex", sessions: 2, phone: "214-708-9559", used: 10, purchased: 30 },
  { name: "Brandon Crow", type: "flex", sessions: 2, phone: "214-535-8662", used: 10, purchased: 30 },
  { name: "Jill Harvey", type: "flex", sessions: 1, phone: "214-435-5495", used: 10, purchased: 30 },
  { name: "Susan Crow", type: "flex", sessions: 1, phone: "214-517-2957", used: 10, purchased: 30 },
  { name: "Autumn Moss", type: "fixed", sessions: 3, duration: 25, phone: "512-970-8143", used: 10, purchased: 30 },
  { name: "Cole Crow", type: "flex", sessions: 1, phone: "214-914-8733", used: 10, purchased: 30 },
  { name: "Lane Crow", type: "flex", sessions: 1, phone: "214-435-7322", used: 10, purchased: 30 },
  { name: "Leah & Leigh Johnson", type: "fixed", sessions: 1, phone: "214-755-5041", used: 10, purchased: 30 },
  { name: "Nicole Stewart", type: "flex", sessions: 1, phone: "214-516-5750", used: 10, purchased: 30 },
  { name: "Jack Charles", type: "flex", sessions: 1, phone: "214-803-4090", used: 10, purchased: 30 },
  { name: "Kate & Jill Harvey", type: "flex", sessions: 1, phone: "214-435-5495", used: 10, purchased: 30 },
  { name: "Molly & Brooke", type: "flex", sessions: 1, phone: "972-571-2060", phone2: "817-881-0927", used: 10, purchased: 30 },
];

// ===================== PRICING & PAYMENT =====================
const PAYMENT = { zelle: "chipphillips89@gmail.com", venmo: "@chip-phillips-2" };

const PKG_PERSONAL = [
  { label: "1 Session", count: 1, price: 170, cat: "Personal Training" },
  { label: "10-Pack", count: 10, price: 1490, cat: "Personal Training" },
  { label: "20-Pack", count: 20, price: 2660, cat: "Personal Training" },
  { label: "30-Pack", count: 30, price: 3570, cat: "Personal Training" },
];
const PKG_SHORT = [
  { label: "25-Min Session", count: 1, price: 93, cat: "Short Sessions" },
  { label: "25-Min 20-Pack", count: 20, price: 1950, cat: "Short Sessions" },
];
const PKG_EXEC = [
  { label: "Executive 1:1 Session", count: 1, price: 295, cat: "Executive" },
  { label: "Executive Retainer (Low)", count: 8, price: 2200, cat: "Executive", monthly: true },
  { label: "Executive Retainer (High)", count: 8, price: 3000, cat: "Executive", monthly: true },
];
const PKG_COUPLES = [
  { label: "Couples 30-Pack", count: 30, price: 4590, cat: "Partner Training", split: 2 },
];
const PKG_TRIO = [
  { label: "Group of 3 — 30-Pack", count: 30, price: 5550, cat: "Group Training", split: 3 },
];
const PKG_REMOTE = [
  { label: "CPF Competitive", count: 1, price: 500, cat: "Remote Coaching", monthly: true },
  { label: "CPF Intermediate", count: 1, price: 405, cat: "Remote Coaching", monthly: true },
  { label: "CPF Custom", count: 1, price: 315, cat: "Remote Coaching", monthly: true },
  { label: "PT Supplemental Add-On", count: 1, price: 99, cat: "Remote Coaching", monthly: true },
];

// "couple" = 50%, "trio" = 33%
const GROUP_CLIENTS = { "Rachael & Lindsay": "couple" };
function getGroupType(name) { return GROUP_CLIENTS[name] || null; }
function isGroupClient(name) { return !!GROUP_CLIENTS[name]; }
function getGroupDivisor(name) { const t = getGroupType(name); return t === "couple" ? 2 : t === "trio" ? 3 : 1; }

function getPackagesForClient(client) {
  const gt = getGroupType(client.name);
  if (client.duration === 25) return PKG_SHORT;
  if (gt === "couple") return [...PKG_PERSONAL, ...PKG_COUPLES];
  if (gt === "trio") return [...PKG_PERSONAL, ...PKG_TRIO];
  return [...PKG_PERSONAL, ...PKG_EXEC, ...PKG_COUPLES, ...PKG_TRIO, ...PKG_REMOTE];
}

function buildInvoiceText(clientName, pkg, groupType) {
  const firstName = clientName.split(" ")[0].split("&")[0].trim();
  const divisor = pkg.split || (groupType === "couple" ? 2 : groupType === "trio" ? 3 : 1);
  const clientTotal = divisor > 1 ? Math.round(pkg.price / divisor) : pkg.price;
  const totalStr = "$" + clientTotal.toLocaleString();
  const mo = pkg.monthly ? "/month" : "";
  let splitLine = "";
  if (divisor === 2) splitLine = `\nFull package value: $${pkg.price.toLocaleString()} — your half: ${totalStr}`;
  else if (divisor === 3) splitLine = `\nFull package value: $${pkg.price.toLocaleString()} — your share (1/3): ${totalStr}`;
  return `Hey ${firstName}! You're getting close to using up your sessions — time to re-up!\n\n${pkg.label}: ${totalStr}${mo}${splitLine}\n\nPay via:\nZelle: ${PAYMENT.zelle}\nVenmo: ${PAYMENT.venmo}\n\nThanks!`;
}

const DEFAULT_SCHEDULE = {
  // MONDAY
  "Monday-5:30 AM": { client: "Greg Pierce", status: "confirmed" },
  "Monday-6:30 AM": { client: "Paulo", status: "confirmed", customTime: "6:25 AM" },
  "Monday-7:30 AM": { client: "Nate Garber", status: "confirmed" },
  "Monday-8:30 AM": { client: "Marnie", status: "confirmed", customTime: "8:15 AM" },
  "Monday-9:30 AM": { client: "Jacque", status: "confirmed", customTime: "9:05 AM" },
  "Monday-10:30 AM": { client: "Kasey Moore", status: "confirmed", customTime: "10:00 AM" },
  "Monday-11:30 AM": { client: "Andrew Welker", status: "confirmed", customTime: "11:00 AM" },
  "Monday-12:30 PM": { client: "Aric McCumber", status: "confirmed", customTime: "12:00 PM" },
  "Monday-1:30 PM": { client: "Kate McCumber", status: "confirmed" },
  "Monday-2:30 PM": { client: "📋 Programming", status: "softblocked" },
  "Monday-3:30 PM": { client: "Autumn Moss", status: "confirmed", customTime: "3:00 PM" },
  "Monday-4:30 PM": { client: "Kate & Jill Harvey", status: "confirmed" },
  "Monday-5:30 PM": { client: "Cole Crow", status: "confirmed", customTime: "5:20 PM" },
  // TUESDAY
  "Tuesday-5:30 AM": { client: "Kirksey Taylor", status: "confirmed" },
  "Tuesday-6:30 AM": { client: "Jack Palms", status: "confirmed" },
  "Tuesday-7:30 AM": { client: "Ryan Young", status: "confirmed", customTime: "7:25 AM" },
  "Tuesday-8:30 AM": { client: "Melanie Paul", status: "confirmed", customTime: "8:15 AM" },
  "Tuesday-9:30 AM": { client: "Rachael & Lindsay", status: "confirmed", customTime: "9:10 AM" },
  "Tuesday-10:30 AM": { client: "Andrew Welker", status: "confirmed", customTime: "10:00 AM" },
  "Tuesday-12:30 PM": { client: "Patti", status: "confirmed", customTime: "12:00 PM" },
  "Tuesday-1:30 PM": { client: "Kate McCumber", status: "confirmed", customTime: "1:00 PM" },
  "Tuesday-2:30 PM": { client: "Susan Crow", status: "confirmed", customTime: "1:50 PM" },
  "Tuesday-3:30 PM": { client: "Autumn Moss", status: "confirmed", customTime: "3:00 PM" },
  "Tuesday-3:30 PM-2": { client: "🚗 Pickup Boys", status: "blocked" },
  "Tuesday-4:30 PM": { client: "Leah & Leigh Johnson", status: "confirmed" },
  "Tuesday-5:30 PM": { client: "Jack Charles", status: "confirmed", customTime: "5:25 PM" },
  // WEDNESDAY
  "Wednesday-5:30 AM": { client: "Greg Pierce", status: "confirmed" },
  "Wednesday-6:30 AM": { client: "Rachael & Lindsay", status: "confirmed", customTime: "6:25 AM" },
  "Wednesday-7:30 AM": { client: "Brandon Crow", status: "confirmed", customTime: "7:20 AM" },
  "Wednesday-8:30 AM": { client: "Marnie", status: "confirmed", customTime: "8:15 AM" },
  "Wednesday-9:30 AM": { client: "Rick", status: "confirmed", customTime: "9:05 AM" },
  "Wednesday-10:30 AM": { client: "Candy Streit", status: "confirmed" },
  "Wednesday-11:30 AM": { client: "Aric McCumber", status: "confirmed" },
  "Wednesday-12:30 PM": { client: "Patti", status: "confirmed" },
  "Wednesday-1:30 PM": { client: "Jill Harvey", status: "confirmed" },
  "Wednesday-2:30 PM": { client: "Molly & Brooke", status: "confirmed" },
  "Wednesday-3:30 PM": { client: "Autumn Moss", status: "confirmed" },
  "Wednesday-4:30 PM": { client: "🚗 Pickup Boys", status: "blocked" },
  "Wednesday-5:30 PM": { client: "👨‍👦 Dad Dates", status: "blocked" },
  // THURSDAY
  "Thursday-5:30 AM": { client: "Madison Palms", status: "confirmed", customTime: "5:25 AM" },
  "Thursday-6:30 AM": { client: "David Spika", status: "confirmed" },
  "Thursday-7:30 AM": { client: "Jacque", status: "confirmed" },
  "Thursday-8:30 AM": { client: "Ryan Culpepper", status: "confirmed" },
  "Thursday-9:30 AM": { client: "Rick", status: "confirmed" },
  "Thursday-10:30 AM": { client: "Andrew Welker", status: "confirmed" },
  "Thursday-11:30 AM": { client: "Brandon Crow", status: "confirmed", customTime: "11:10 AM" },
  "Thursday-12:30 PM": { client: "Candy Streit", status: "confirmed", customTime: "12:10 PM" },
  "Thursday-1:30 PM": { client: "Ryan Young", status: "confirmed", customTime: "1:05 PM" },
  "Thursday-2:30 PM": { client: "🚗 Pickup Boys", status: "blocked" },
  "Thursday-3:30 PM": { client: "👨‍👦 Dad Dates", status: "blocked" },
  // FRIDAY
  "Friday-5:30 AM": { client: "Paulo", status: "confirmed" },
  "Friday-6:30 AM": { client: "Jack Palms", status: "confirmed" },
  "Friday-7:30 AM": { client: "Nate Garber", status: "confirmed" },
  "Friday-8:30 AM": { client: "Melanie Paul", status: "confirmed" },
  "Friday-9:30 AM": { client: "Ana Ambrosi", status: "confirmed" },
  "Friday-10:30 AM": { client: "Madison Palms", status: "confirmed" },
  "Friday-11:30 AM": { client: "🚗 Pickup Boys", status: "blocked" },
};

const STATUS_COLORS = {
  confirmed: { bg: "#C8E6C9", text: "#1B5E20", border: "#66BB6A", label: "✓" },
  pending: { bg: "#FFE0B2", text: "#E65100", border: "#FFA726", label: "?" },
  cancelled: { bg: "#FFCDD2", text: "#B71C1C", border: "#EF5350", label: "✗" },
  blocked: { bg: "#E1BEE7", text: "#4A148C", border: "#AB47BC", label: "🚫" },
  softblocked: { bg: "#D1C4E9", text: "#311B92", border: "#9575CD", label: "~" },
};

const BLOCK_PRESETS = [
  { label: "Pickup Boys", icon: "🚗", bookable: false },
  { label: "Programming", icon: "📋", bookable: true },
  { label: "Bike / Workout", icon: "🚴", bookable: false },
  { label: "Payroll", icon: "💰", bookable: true },
  { label: "Lunch / Break", icon: "🍽", bookable: false },
  { label: "Dad Dates", icon: "👨‍👦", bookable: false },
  { label: "Appointment", icon: "📅", bookable: false },
];

function getOpenSlots(schedule, clients) {
  const open = [];
  const softBlocked = [];
  DAYS.forEach(day => {
    DAY_SLOTS[day].forEach(time => {
      const key = `${day}-${time}`;
      const entry = schedule[key];
      if (!entry || entry.status === "cancelled") {
        open.push({ key, day, time, label: `${day.slice(0,3)} ${time}` });
      } else if (entry.status === "softblocked") {
        softBlocked.push({ key, day, time, label: `${day.slice(0,3)} ${time}`, blockLabel: entry.client });
      } else {
        // Check if this is a 25-min client with a bookable gap
        const ci = clients.find(c => c.name === entry.client);
        if (ci?.duration === 25) {
          const gapKey = `${day}-${time}-gap`;
          if (!schedule[gapKey]) {
            open.push({ key: gapKey, day, time, label: `${day.slice(0,3)} ${time} (gap)`, isGap: true });
          }
        }
      }
    });
  });
  return { open, softBlocked };
}

function shortDay(day) { return day.slice(0,3); }

function calcGapTime(timeStr) {
  // Add 25 minutes to a time string like "9:30 AM" → "9:55 AM"
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let h = parseInt(match[1]); const m = parseInt(match[2]); const ampm = match[3].toUpperCase();
  let h24 = h; if (ampm === "PM" && h !== 12) h24 += 12; if (ampm === "AM" && h === 12) h24 = 0;
  let totalMin = h24 * 60 + m + 25;
  let nh = Math.floor(totalMin / 60); let nm = totalMin % 60;
  const nAmpm = nh >= 12 ? "PM" : "AM";
  let nh12 = nh > 12 ? nh - 12 : nh === 0 ? 12 : nh;
  return `${nh12}:${String(nm).padStart(2, '0')} ${nAmpm}`;
}

function getMonday() {
  return "Mar 30, 2026";
}

// ===================== STORAGE =====================
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
}
function loadData(key, fallback) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch(e) { return fallback; }
}


// ===================== MAIN APP =====================
export default function App() {
  const [appView, setAppView] = useState("schedule");
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [weekLabel, setWeekLabel] = useState(getMonday);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [nextWeekLabel, setNextWeekLabel] = useState("");
  const [clients, setClients] = useState(CLIENTS);
  const [sundayNotes, setSundayNotes] = useState({});
  const [sundaySent, setSundaySent] = useState(new Set());
  const [nextSundayNotes, setNextSundayNotes] = useState({});
  const [nextSundaySent, setNextSundaySent] = useState(new Set());
  const [weekHistory, setWeekHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = loadData("pt-schedule", null); if (s) setSchedule(s);
    const w = loadData("pt-week", null); if (w) setWeekLabel(w);
    const ns = loadData("pt-next-schedule", null); if (ns) setNextSchedule(ns);
    const nw = loadData("pt-next-week", null); if (nw) setNextWeekLabel(nw);
    const c = loadData("pt-clients", null); if (c) setClients(c);
    const sn = loadData("pt-sunday-notes", null); if (sn) setSundayNotes(sn);
    const ss = loadData("pt-sunday-sent", null); if (ss) setSundaySent(new Set(ss));
    const nsn = loadData("pt-next-sunday-notes", null); if (nsn) setNextSundayNotes(nsn);
    const nss = loadData("pt-next-sunday-sent", null); if (nss) setNextSundaySent(new Set(nss));
    const h = loadData("pt-week-history", null); if (h) setWeekHistory(h);
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) saveData("pt-schedule", schedule); }, [schedule, loaded]);
  useEffect(() => { if (loaded) saveData("pt-week", weekLabel); }, [weekLabel, loaded]);
  useEffect(() => { if (loaded) saveData("pt-next-schedule", nextSchedule); }, [nextSchedule, loaded]);
  useEffect(() => { if (loaded) saveData("pt-next-week", nextWeekLabel); }, [nextWeekLabel, loaded]);
  useEffect(() => { if (loaded) saveData("pt-clients", clients); }, [clients, loaded]);
  useEffect(() => { if (loaded) saveData("pt-sunday-notes", sundayNotes); }, [sundayNotes, loaded]);
  useEffect(() => { if (loaded) saveData("pt-sunday-sent", [...sundaySent]); }, [sundaySent, loaded]);
  useEffect(() => { if (loaded) saveData("pt-next-sunday-notes", nextSundayNotes); }, [nextSundayNotes, loaded]);
  useEffect(() => { if (loaded) saveData("pt-next-sunday-sent", [...nextSundaySent]); }, [nextSundaySent, loaded]);
  useEffect(() => { if (loaded) saveData("pt-week-history", weekHistory); }, [weekHistory, loaded]);

  function advanceWeekLabel(label) {
    try {
      const d = new Date(label);
      if (!isNaN(d.getTime())) { d.setDate(d.getDate() + 7); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    } catch(e) {}
    return label + " (next)";
  }

  function copyScheduleForward(sched) {
    const n = {};
    Object.entries(sched).forEach(([key, entry]) => {
      if (entry.status === "blocked" || entry.status === "softblocked") n[key] = { ...entry };
      else if (entry.status !== "cancelled") n[key] = { ...entry, status: "pending" };
    });
    return n;
  }

  const startNextWeek = () => {
    setNextSchedule(copyScheduleForward(schedule));
    setNextWeekLabel(advanceWeekLabel(weekLabel));
    setNextSundayNotes({});
    setNextSundaySent(new Set());
  };

  const closeCurrentWeek = () => {
    if (confirm("Close out this week? It will be archived to History and next week becomes the live schedule.")) {
      const archived = {
        weekLabel, schedule: { ...schedule }, savedAt: new Date().toISOString(),
        sessionCount: Object.values(schedule).filter(s => s.status !== "blocked" && s.status !== "softblocked").length,
        confirmedCount: Object.values(schedule).filter(s => s.status === "confirmed").length,
      };
      setWeekHistory(prev => [archived, ...prev]);
      if (nextSchedule) {
        setSchedule(nextSchedule); setWeekLabel(nextWeekLabel);
        setSundayNotes(nextSundayNotes); setSundaySent(nextSundaySent);
      } else {
        setSchedule(copyScheduleForward(schedule)); setWeekLabel(advanceWeekLabel(weekLabel));
        setSundayNotes({}); setSundaySent(new Set());
      }
      setNextSchedule(null); setNextWeekLabel(""); setNextSundayNotes({}); setNextSundaySent(new Set());
    }
  };

  const loadPastWeek = (entry) => { setSchedule(entry.schedule); setWeekLabel(entry.weekLabel); setAppView("schedule"); };

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "system-ui" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#F5F5F0", minHeight: "100vh", color: "#1a1a1a", paddingBottom: 70 }}>
      {appView === "schedule" && (
        <ScheduleView
          schedule={schedule} setSchedule={setSchedule} weekLabel={weekLabel} setWeekLabel={setWeekLabel}
          nextSchedule={nextSchedule} setNextSchedule={setNextSchedule} nextWeekLabel={nextWeekLabel} setNextWeekLabel={setNextWeekLabel}
          clients={clients} setClients={setClients}
          startNextWeek={startNextWeek} closeCurrentWeek={closeCurrentWeek}
        />
      )}
      {appView === "send" && (
        <SundaySendView
          schedule={schedule} weekLabel={weekLabel} notes={sundayNotes} setNotes={setSundayNotes} sent={sundaySent} setSent={setSundaySent}
          nextSchedule={nextSchedule} nextWeekLabel={nextWeekLabel} nextNotes={nextSundayNotes} setNextNotes={setNextSundayNotes} nextSent={nextSundaySent} setNextSent={setNextSundaySent}
          clients={clients}
        />
      )}
      {appView === "clients" && <ClientsView clients={clients} setClients={setClients} schedule={schedule} />}
      {appView === "history" && <HistoryView weekHistory={weekHistory} setWeekHistory={setWeekHistory} clients={clients} onLoad={loadPastWeek} />}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E0E0E0", display: "flex", zIndex: 90 }}>
        {[
          { key: "schedule", icon: "📅", label: "Schedule" },
          { key: "send", icon: "💬", label: "Sunday Send" },
          { key: "clients", icon: "👥", label: "Clients" },
          { key: "history", icon: "📂", label: "History" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setAppView(tab.key)} style={{
            flex: 1, padding: "8px 0", border: "none", background: appView === tab.key ? "#E3F2FD" : "white",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: appView === tab.key ? 700 : 400, color: appView === tab.key ? "#1B2A4A" : "#888" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== SCHEDULE VIEW =====================
function ScheduleView({ schedule, setSchedule, weekLabel, setWeekLabel, nextSchedule, setNextSchedule, nextWeekLabel, setNextWeekLabel, clients, setClients, startNextWeek, closeCurrentWeek }) {
  const [viewingWeek, setViewingWeek] = useState("current");
  const isNext = viewingWeek === "next" && nextSchedule;
  const activeSchedule = isNext ? nextSchedule : schedule;
  const setActiveSchedule = isNext ? setNextSchedule : setSchedule;
  const activeWeekLabel = isNext ? nextWeekLabel : weekLabel;

  const [panelMode, setPanelMode] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [editingWeek, setEditingWeek] = useState(false);
  const [selectedOpenSlots, setSelectedOpenSlots] = useState([]);
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [customBlockLabel, setCustomBlockLabel] = useState("");
  const [editTimeValue, setEditTimeValue] = useState("");
  const [invoiceClient, setInvoiceClient] = useState(null);
  const [dragItem, setDragItem] = useState(null);
  const [dragClient, setDragClient] = useState(null);

  const scheduledClients = new Set(Object.values(activeSchedule).filter(s => s.status !== "blocked" && s.status !== "softblocked").map(s => s.client));
  const unscheduled = clients.filter(c => !scheduledClients.has(c.name));
  const totalSessions = Object.values(activeSchedule).filter(s => s.status !== "blocked" && s.status !== "softblocked").length;
  const confirmedCount = Object.values(activeSchedule).filter(s => s.status === "confirmed").length;
  const pendingCount = Object.values(activeSchedule).filter(s => s.status === "pending").length;
  const { open: openSlots, softBlocked: softBlockedSlots } = getOpenSlots(activeSchedule, clients);
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const getClientBalance = (name) => {
    const c = clients.find(cl => cl.name === name);
    return c ? { used: c.used || 0, purchased: c.purchased || 30 } : { used: 0, purchased: 30 };
  };
  const adjustUsed = (name, delta) => {
    setClients(prev => prev.map(c => c.name === name ? { ...c, used: Math.max(0, (c.used || 0) + delta) } : c));
  };

  const handleSlotClick = (key) => {
    setSelectedSlot(key); setSearch(""); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel("");
    const entry = activeSchedule[key];
    if (entry && (entry.status === "blocked" || entry.status === "softblocked")) setPanelMode("block-actions");
    else if (entry) setPanelMode("actions");
    else setPanelMode("empty-actions");
  };

  const assignClient = (name) => { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { client: name, status: "pending" } })); closePanel(); };
  const clearSlot = (key) => setActiveSchedule(prev => { const n = { ...prev }; delete n[key]; return n; });

  const cycleStatus = (key, e) => {
    e.stopPropagation();
    const entry = activeSchedule[key]; if (!entry) return;
    const order = ["confirmed", "pending", "cancelled"];
    const oldStatus = entry.status;
    const newStatus = order[(order.indexOf(oldStatus) + 1) % 3];
    if (newStatus === "confirmed" && oldStatus !== "confirmed") {
      adjustUsed(entry.client, 1);
      const ci = clients.find(c => c.name === entry.client);
      if (ci) {
        const remaining = (ci.purchased || 30) - ((ci.used || 0) + 1);
        if (remaining === 1) setTimeout(() => setInvoiceClient(ci.name), 300);
      }
    }
    if (oldStatus === "confirmed" && newStatus !== "confirmed") adjustUsed(entry.client, -1);
    setActiveSchedule(prev => ({ ...prev, [key]: { ...prev[key], status: newStatus } }));
  };

  const closePanel = () => { setPanelMode(null); setSelectedSlot(null); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); };

  const buildRescheduleText = () => {
    const entry = activeSchedule[selectedSlot]; if (!entry) return "";
    const firstName = entry.client.split(" ")[0].split("&")[0].trim();
    const [origDay, origTime] = selectedSlot.split("-");
    const displayTime = entry.customTime || origTime;
    const slotsText = selectedOpenSlots.map(s => s.label).join(", ");
    const noteText = rescheduleNote.trim() ? ` ${rescheduleNote.trim()}` : "";
    if (selectedOpenSlots.length === 1) return `Hey ${firstName}!${noteText} How about ${selectedOpenSlots[0].label} instead of ${shortDay(origDay)} ${displayTime}? Let me know!`;
    return `Hey ${firstName}!${noteText} No worries on ${shortDay(origDay)} ${displayTime} — I've got a few openings: ${slotsText}. Which works best for you?`;
  };

  const handleSendReschedule = () => {
    const entry = activeSchedule[selectedSlot]; if (!entry) return;
    const client = clients.find(c => c.name === entry.client);
    window.open(`sms:${client?.phone || ""}&body=${encodeURIComponent(buildRescheduleText())}`, "_blank");
    setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], status: "cancelled" } }));
    closePanel();
  };

  const handleConfirmReschedule = (newKey) => {
    const entry = activeSchedule[selectedSlot]; if (!entry) return;
    setActiveSchedule(prev => { const n = { ...prev }; n[newKey] = { client: entry.client, status: "confirmed" }; delete n[selectedSlot]; return n; });
    closePanel();
  };

  const toggleOpenSlot = (slot) => {
    setSelectedOpenSlots(prev => {
      if (prev.find(s => s.key === slot.key)) return prev.filter(s => s.key !== slot.key);
      if (prev.length >= 3) return prev;
      return [...prev, slot];
    });
  };

  const handleDrop = (targetKey, sourceKey) => {
    if (dragClient) {
      setActiveSchedule(prev => ({ ...prev, [targetKey]: { client: dragClient, status: "pending" } }));
      setDragClient(null);
      return;
    }
    if (!sourceKey || sourceKey === targetKey) return;
    setActiveSchedule(prev => {
      const next = { ...prev }; const dd = next[sourceKey]; const td = next[targetKey];
      if (dd && td) { next[sourceKey] = td; next[targetKey] = dd; }
      else if (dd) { next[targetKey] = dd; delete next[sourceKey]; }
      return next;
    });
  };

  return (
    <>
      {/* HEADER */}
      <div style={{ background: isNext ? "linear-gradient(135deg, #1a3a1a 0%, #2a5a2a 100%)" : "linear-gradient(135deg, #1B2A4A 0%, #2C3E6B 100%)", padding: "16px 20px 12px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{isNext ? "Next Week" : "This Week"}</h1>
            {editingWeek ? (
              <input autoFocus value={activeWeekLabel} onChange={e => (isNext ? setNextWeekLabel : setWeekLabel)(e.target.value)}
                onBlur={() => setEditingWeek(false)} onKeyDown={e => e.key === "Enter" && setEditingWeek(false)}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 8px", fontSize: 14, fontWeight: 600, marginTop: 4 }} />
            ) : (
              <span onClick={() => setEditingWeek(true)} style={{ fontSize: 14, opacity: 0.9, cursor: "pointer", borderBottom: "1px dashed rgba(255,255,255,0.4)" }}>Week of {activeWeekLabel}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {!isNext && !nextSchedule && (
              <button onClick={startNextWeek} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, color: "white", padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Start Next Week</button>
            )}
            {!isNext && nextSchedule && (
              <button onClick={closeCurrentWeek} style={{ background: "rgba(239,83,80,0.2)", border: "1px solid rgba(239,83,80,0.4)", borderRadius: 8, color: "#FFCDD2", padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Close Out Week</button>
            )}
          </div>
        </div>

        {/* WEEK TOGGLE TABS */}
        {nextSchedule && (
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={() => setViewingWeek("current")} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: viewingWeek === "current" ? "2px solid white" : "1px solid rgba(255,255,255,0.2)",
              background: viewingWeek === "current" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              color: "white", fontSize: 12, fontWeight: viewingWeek === "current" ? 700 : 400, cursor: "pointer",
            }}>📅 This Week · {weekLabel}</button>
            <button onClick={() => setViewingWeek("next")} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: viewingWeek === "next" ? "2px solid white" : "1px solid rgba(255,255,255,0.2)",
              background: viewingWeek === "next" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              color: "white", fontSize: 12, fontWeight: viewingWeek === "next" ? 700 : 400, cursor: "pointer",
            }}>📋 Next Week · {nextWeekLabel}</button>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11 }}>
          <span style={{ opacity: 0.7 }}>{totalSessions} sessions</span>
          <span style={{ color: "#81C784" }}>✓{confirmedCount}</span>
          <span style={{ color: "#FFB74D" }}>?{pendingCount}</span>
        </div>
      </div>

      {/* GRID */}
      <div style={{ padding: "12px 8px", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "54px repeat(5, 1fr)", gap: 2 }}>
          <div />
          {DAYS.map((day, i) => (
            <div key={day} style={{ background: isNext ? "#1a3a1a" : "#1B2A4A", color: "white", textAlign: "center", padding: "5px 2px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
              {day.slice(0, 3)}<div style={{ fontSize: 8, opacity: 0.7, fontWeight: 400 }}>{day === "Friday" ? "→ 3:30" : "→ 7 PM"}</div>
            </div>
          ))}
          {ALL_TIMES.map(time => {
            const has25 = DAYS.some(day => {
              const entry = activeSchedule[`${day}-${time}`];
              if (!entry || entry.status === "blocked" || entry.status === "softblocked") return false;
              const ci = clients.find(c => c.name === entry.client);
              return ci?.duration === 25;
            });
            const hasGapEntry = DAYS.some(day => activeSchedule[`${day}-${time}-gap`]);

            return (
              <>
                <div key={`t-${time}`} style={{ fontSize: 9, fontWeight: 600, color: "#555", display: "flex", alignItems: "center", justifyContent: "center", minHeight: has25 ? 32 : 42 }}>{time}</div>
                {DAYS.map(day => {
                  const key = `${day}-${time}`; const isAvail = DAY_SLOTS[day].includes(time); const entry = activeSchedule[key];
                  if (!isAvail) return <div key={key} style={{ background: "#ECEFF1", borderRadius: 4, minHeight: has25 ? 32 : 42, opacity: 0.4 }} />;
                  if (entry && entry.status === "blocked") {
                    return (
                      <div key={key} draggable onDragStart={() => setDragItem(key)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(key, dragItem); setDragItem(null); }}
                        onClick={() => handleSlotClick(key)}
                        style={{ background: "linear-gradient(135deg, #E1BEE7, #CE93D8)", border: "1.5px solid #AB47BC", borderRadius: 6, padding: "2px 4px", cursor: "grab", minHeight: has25 ? 32 : 42, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: 7, fontWeight: 700, color: "#7B1FA2", opacity: 0.7 }}>{entry.customTime || time}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#4A148C", lineHeight: 1.1 }}>{entry.client}</div>
                      </div>);
                  }
                  if (entry && entry.status === "softblocked") {
                    return (
                      <div key={key} draggable onDragStart={() => setDragItem(key)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(key, dragItem); setDragItem(null); }}
                        onClick={() => handleSlotClick(key)}
                        style={{ background: "linear-gradient(135deg, #D1C4E9, #B39DDB)", border: "1.5px dashed #9575CD", borderRadius: 6, padding: "2px 4px", cursor: "grab", minHeight: has25 ? 32 : 42, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: 7, fontWeight: 700, color: "#5E35B1", opacity: 0.7 }}>{entry.customTime || time}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#311B92", lineHeight: 1.1 }}>{entry.client}</div>
                        <div style={{ fontSize: 7, color: "#5E35B1" }}>IF NEEDED</div>
                      </div>);
                  }
                  if (entry) {
                    const s = STATUS_COLORS[entry.status]; const ci = clients.find(c => c.name === entry.client);
                    const is25 = ci?.duration === 25;
                    const displayTime = entry.customTime || time;
                    const bal = getClientBalance(entry.client);
                    const remaining = bal.purchased - bal.used;
                    const balColor = remaining <= 0 ? "#C62828" : remaining <= 3 ? "#E65100" : s.text;
                    const balBg = remaining <= 0 ? "#FFCDD2" : remaining <= 3 ? "#FFE0B2" : "rgba(0,0,0,0.06)";
                    return (
                      <div key={key} draggable onDragStart={() => setDragItem(key)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(key, dragItem); setDragItem(null); }}
                        onClick={() => handleSlotClick(key)}
                        style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 6, padding: "2px 4px", cursor: "grab", minHeight: is25 ? 26 : (has25 ? 32 : 42), display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
                        <div style={{ position: "absolute", top: 2, right: 3, background: balBg, borderRadius: 3, padding: "0 3px", fontSize: 7, fontWeight: 800, color: balColor, lineHeight: "12px" }}>{bal.used}/{bal.purchased}</div>
                        <div style={{ fontSize: 7, fontWeight: 700, color: s.text, opacity: 0.6, lineHeight: 1 }}>{displayTime}{is25 ? " · 25m" : ""}</div>
                        <div style={{ fontSize: is25 ? 9 : 10, fontWeight: 600, color: s.text, lineHeight: 1.2, marginTop: 1, paddingRight: 16 }}>{entry.client}</div>
                        {!is25 && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                            <span style={{ fontSize: 7, opacity: 0.7, color: s.text }}>{ci?.type === "fixed" ? "Fixed" : "Flex"}</span>
                            <button onClick={e => cycleStatus(key, e)} style={{ background: "rgba(0,0,0,0.08)", border: "none", borderRadius: 3, width: 15, height: 15, fontSize: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: s.text, fontWeight: 700 }}>{s.label}</button>
                          </div>
                        )}
                      </div>);
                  }
                  return (
                    <div key={key} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(key, dragItem); setDragItem(null); }}
                      onClick={() => handleSlotClick(key)}
                      style={{ background: "#FAFAFA", border: "1.5px dashed #DDD", borderRadius: 6, minHeight: has25 ? 32 : 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <span style={{ fontSize: 9, color: "#CCC" }}>+</span>
                    </div>);
                })}

                {/* Gap sub-row */}
                {(has25 || hasGapEntry) && (
                  <>
                    <div key={`g-${time}`} style={{ fontSize: 7, fontWeight: 600, color: "#AAA", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 24, fontStyle: "italic" }}>
                      {(() => { for (const d of DAYS) { const e = activeSchedule[`${d}-${time}`]; if (e && e.status !== "blocked" && e.status !== "softblocked") { const c = clients.find(cl => cl.name === e.client); if (c?.duration === 25) return calcGapTime(e.customTime || time); } } return "gap"; })()}
                    </div>
                    {DAYS.map(day => {
                      const mainKey = `${day}-${time}`; const gapKey = `${day}-${time}-gap`;
                      const isAvail = DAY_SLOTS[day].includes(time);
                      const mainEntry = activeSchedule[mainKey]; const gapEntry = activeSchedule[gapKey];
                      const mainClient = mainEntry ? clients.find(c => c.name === mainEntry.client) : null;
                      const mainIs25 = mainClient?.duration === 25;
                      const gapStartTime = mainIs25 ? calcGapTime(mainEntry?.customTime || time) : "";
                      if (!isAvail) return <div key={gapKey} style={{ background: "#ECEFF1", borderRadius: 3, minHeight: 24, opacity: 0.3 }} />;
                      if (mainIs25 && !gapEntry) {
                        return (
                          <div key={gapKey} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                            onClick={() => { setSelectedSlot(gapKey); setSearch(""); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); setPanelMode("empty-actions"); }}
                            style={{ background: "#F0FFF0", border: "1px dashed #A5D6A7", borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <span style={{ fontSize: 7, color: "#66BB6A", fontWeight: 600 }}>OFF {gapStartTime}</span>
                            <span style={{ fontSize: 6, color: "#81C784" }}>tap to book</span>
                          </div>);
                      }
                      if (gapEntry) {
                        if (gapEntry.status === "blocked" || gapEntry.status === "softblocked") {
                          return (
                            <div key={gapKey} draggable onDragStart={() => setDragItem(gapKey)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                              onClick={() => { setSelectedSlot(gapKey); setPanelMode("block-actions"); }}
                              style={{ background: gapEntry.status === "blocked" ? "#E1BEE7" : "#D1C4E9", border: `1px solid ${gapEntry.status === "blocked" ? "#AB47BC" : "#9575CD"}`, borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1px 3px", cursor: "grab" }}>
                              <div style={{ fontSize: 7, fontWeight: 700, color: "#4A148C" }}>{gapEntry.client}</div>
                            </div>);
                        }
                        const gs = STATUS_COLORS[gapEntry.status] || STATUS_COLORS.pending;
                        return (
                          <div key={gapKey} draggable onDragStart={() => setDragItem(gapKey)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                            onClick={() => { setSelectedSlot(gapKey); setPanelMode("actions"); }}
                            style={{ background: gs.bg, border: `1px solid ${gs.border}`, borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1px 3px", cursor: "grab" }}>
                            <div style={{ fontSize: 7, fontWeight: 700, color: gs.text, opacity: 0.6 }}>{gapEntry.customTime || "gap"}</div>
                            <div style={{ fontSize: 8, fontWeight: 600, color: gs.text }}>{gapEntry.client}</div>
                          </div>);
                      }
                      return <div key={gapKey} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }} style={{ background: "#F9F9F6", borderRadius: 3, minHeight: 24, opacity: 0.3 }} />;
                    })}
                  </>
                )}
              </>
            );
          })}
        </div>

        {/* Unscheduled */}
        {unscheduled.length > 0 && (
          <div style={{ marginTop: 14, background: "white", borderRadius: 8, padding: 10, border: "1px solid #E0E0E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1565C0", marginBottom: 6 }}>Unscheduled ({unscheduled.length}) — drag to a slot</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {unscheduled.map(c => {
                const bal = c.used || 0; const pur = c.purchased || 30; const remaining = pur - bal;
                const balColor = remaining <= 0 ? "#C62828" : remaining <= 3 ? "#E65100" : "#555";
                return (
                  <span key={c.name} draggable onDragStart={() => setDragClient(c.name)} onDragEnd={() => setDragClient(null)}
                    style={{ background: c.type === "fixed" ? "#E8F5E9" : "#FFF8E1", border: `1px solid ${c.type === "fixed" ? "#A5D6A7" : "#FFE082"}`, borderRadius: 10, padding: "4px 10px", fontSize: 10, fontWeight: 500, cursor: "grab", display: "inline-flex", alignItems: "center", gap: 4, userSelect: "none" }}>
                    {c.name}
                    <span style={{ fontSize: 8, fontWeight: 800, color: balColor, background: "rgba(0,0,0,0.06)", borderRadius: 3, padding: "0 3px" }}>{bal}/{pur}</span>
                    {c.duration === 25 && <span style={{ fontSize: 7, background: "#F3E5F5", color: "#7B1FA2", padding: "0 3px", borderRadius: 3, fontWeight: 700 }}>25m</span>}
                  </span>);
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===== ACTION PANELS ===== */}
      {panelMode === "actions" && selectedSlot && activeSchedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={activeSchedule[selectedSlot].client} />
          {activeSchedule[selectedSlot].customTime && (
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <span style={{ background: "#E3F2FD", color: "#1565C0", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>Actual start: {activeSchedule[selectedSlot].customTime}</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="⏱" label="Edit Start Time" desc={activeSchedule[selectedSlot].customTime ? `Currently ${activeSchedule[selectedSlot].customTime}` : "Set actual start time"} color="#E8EAF6" borderColor="#9FA8DA"
              onClick={() => { setEditTimeValue(activeSchedule[selectedSlot].customTime || ""); setPanelMode("edit-time"); }} />
            <ActionButton icon="🔄" label="Reschedule" desc="Pick open slots & text options" color="#E3F2FD" borderColor="#90CAF9"
              onClick={() => { setPanelMode("reschedule"); setSelectedOpenSlots([]); setRescheduleNote(""); }} />
            <ActionButton icon="↔" label="Move Slot" desc="Reassign without texting" color="#FFF8E1" borderColor="#FFE082"
              onClick={() => setPanelMode("assign")} />
            <ActionButton icon="✕" label="Cancel" desc="Mark as cancelled" color="#FFEBEE" borderColor="#EF9A9A"
              onClick={() => { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], status: "cancelled" } })); closePanel(); }} />
            <ActionButton icon="🗑" label="Clear" desc="Remove from schedule" color="#F5F5F5" borderColor="#E0E0E0"
              onClick={() => { clearSlot(selectedSlot); closePanel(); }} />
          </div>
        </Overlay>
      )}

      {panelMode === "edit-time" && selectedSlot && activeSchedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`${activeSchedule[selectedSlot].client} — Edit Start Time`} />
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10, textAlign: "center" }}>
            Slot is in the {selectedSlot.split("-").slice(1).join("-")} row. Set the actual start time:
          </div>
          <input autoFocus value={editTimeValue} onChange={e => setEditTimeValue(e.target.value)}
            placeholder="e.g. 6:25 AM, 9:05 AM" onKeyDown={e => { if (e.key === "Enter") { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], customTime: editTimeValue.trim() || undefined } })); closePanel(); } }}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #9FA8DA", fontSize: 16, textAlign: "center", boxSizing: "border-box", fontWeight: 600 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], customTime: editTimeValue.trim() || undefined } })); closePanel(); }}
              style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white" }}>Save</button>
            {activeSchedule[selectedSlot].customTime && (
              <button onClick={() => { setActiveSchedule(prev => { const n = { ...prev }; const e = { ...n[selectedSlot] }; delete e.customTime; n[selectedSlot] = e; return n; }); closePanel(); }}
                style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #EF9A9A", background: "#FFEBEE", color: "#C62828", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Reset</button>
            )}
          </div>
        </Overlay>
      )}

      {panelMode === "reschedule" && selectedSlot && activeSchedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`Reschedule ${activeSchedule[selectedSlot].client}`} />
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10, textAlign: "center" }}>Tap 2-3 slots to offer as alternatives</div>
          <div style={{ maxHeight: "45vh", overflow: "auto", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1B5E20", marginBottom: 6, padding: "4px 8px", background: "#E8F5E9", borderRadius: 6 }}>Open Training Times</div>
            {DAYS.map(day => {
              const dayOpen = openSlots.filter(s => s.day === day);
              if (!dayOpen.length) return null;
              return (
                <div key={`open-${day}`} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 3 }}>{day}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {dayOpen.map(slot => {
                      const isSel = selectedOpenSlots.find(s => s.key === slot.key);
                      return <button key={slot.key} onClick={() => toggleOpenSlot(slot)} style={{
                        padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: isSel ? "#1B2A4A" : "#F5F5F5", color: isSel ? "white" : "#555",
                        border: `1.5px solid ${isSel ? "#1B2A4A" : "#DDD"}`,
                      }}>{slot.time} {isSel && "✓"}</button>;
                    })}
                  </div>
                </div>);
            })}
            {softBlockedSlots.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#5E35B1", marginBottom: 6, marginTop: 8, padding: "4px 8px", background: "#EDE7F6", borderRadius: 6 }}>Secondary (Soft-Blocked)</div>
                {DAYS.map(day => {
                  const daySoft = softBlockedSlots.filter(s => s.day === day);
                  if (!daySoft.length) return null;
                  return (
                    <div key={`soft-${day}`} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 3 }}>{day}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {daySoft.map(slot => {
                          const isSel = selectedOpenSlots.find(s => s.key === slot.key);
                          return <button key={slot.key} onClick={() => toggleOpenSlot(slot)} style={{
                            padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            background: isSel ? "#5E35B1" : "#F3E5F5", color: isSel ? "white" : "#7B1FA2",
                            border: `1.5px solid ${isSel ? "#5E35B1" : "#CE93D8"}`,
                          }}>{slot.time} {isSel && "✓"}</button>;
                        })}
                      </div>
                    </div>);
                })}
              </>
            )}
          </div>
          {selectedOpenSlots.length > 0 && (
            <button onClick={() => setPanelMode("reschedule-text")} style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white",
            }}>Preview Text ({selectedOpenSlots.length} option{selectedOpenSlots.length > 1 ? "s" : ""})</button>
          )}
        </Overlay>
      )}

      {panelMode === "reschedule-text" && selectedSlot && activeSchedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`Text ${activeSchedule[selectedSlot].client}`} />
          <textarea value={rescheduleNote} onChange={e => setRescheduleNote(e.target.value)} placeholder="Add a personal note (optional)"
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 36, boxSizing: "border-box", marginBottom: 10, background: "#FAFAF8" }} />
          <div style={{ padding: 12, borderRadius: 14, background: "#E8F5E9", fontSize: 13, lineHeight: 1.5, borderBottomLeftRadius: 4, marginBottom: 12 }}>{buildRescheduleText()}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSendReschedule} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white" }}>Send & Cancel Slot</button>
            {selectedOpenSlots.length === 1 && (
              <button onClick={() => handleConfirmReschedule(selectedOpenSlots[0].key)} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #A5D6A7", background: "#E8F5E9", color: "#1B5E20", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Just Move</button>
            )}
          </div>
        </Overlay>
      )}

      {panelMode === "assign" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={activeSchedule[selectedSlot]?.client ? `Replace ${activeSchedule[selectedSlot].client}` : "Assign Client"} />
          <input autoFocus placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #E0DED8", fontSize: 14, background: "white", boxSizing: "border-box", marginBottom: 8 }} />
          <div style={{ maxHeight: "50vh", overflow: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {filteredClients.map(c => {
              const count = Object.values(activeSchedule).filter(s => s.client === c.name && s.status !== "blocked").length;
              return (
                <button key={c.name} onClick={() => assignClient(c.name)} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 6, border: "1px solid #EEE",
                  background: scheduledClients.has(c.name) ? "#F5F5F5" : "white", cursor: "pointer", textAlign: "left", fontSize: 13,
                }}>
                  <span><strong>{c.name}</strong><span style={{ color: "#888", marginLeft: 6, fontSize: 11 }}>{c.type === "fixed" ? "Fixed" : "Flex"}{c.duration === 25 ? " · 25m" : ""}</span></span>
                  <span style={{ fontSize: 11, color: count >= c.sessions ? "#4CAF50" : "#FF9800" }}>{count}/{c.sessions}</span>
                </button>);
            })}
          </div>
        </Overlay>
      )}

      {panelMode === "empty-actions" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle="What do you need here?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="👤" label="Assign Client" desc="Schedule a training session" color="#E3F2FD" borderColor="#90CAF9" onClick={() => setPanelMode("assign")} />
            <ActionButton icon="🚫" label="Block Time" desc="Personal time — can't be scheduled over" color="#F3E5F5" borderColor="#CE93D8" onClick={() => setPanelMode("block-select")} />
          </div>
        </Overlay>
      )}

      {panelMode === "block-select" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle="Block this time for..." />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {BLOCK_PRESETS.map(preset => (
              <button key={preset.label} onClick={() => { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { client: preset.label, status: preset.soft ? "softblocked" : "blocked" } })); closePanel(); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${preset.soft ? "#9575CD" : "#AB47BC"}`, background: preset.soft ? "#EDE7F6" : "#F3E5F5", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 18 }}>{preset.icon}</span>
                <div><div style={{ fontWeight: 600, fontSize: 13, color: "#4A148C" }}>{preset.label}</div><div style={{ fontSize: 10, color: "#7B1FA2" }}>{preset.soft ? "Soft block — can train if needed" : "Hard block — no training"}</div></div>
              </button>
            ))}
            <div style={{ marginTop: 4 }}>
              <input placeholder="Custom label..." value={customBlockLabel} onChange={e => setCustomBlockLabel(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && customBlockLabel.trim()) { setActiveSchedule(prev => ({ ...prev, [selectedSlot]: { client: customBlockLabel.trim(), status: "blocked" } })); closePanel(); } }}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CE93D8", fontSize: 13, boxSizing: "border-box" }} />
            </div>
          </div>
        </Overlay>
      )}

      {panelMode === "block-actions" && selectedSlot && activeSchedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={activeSchedule[selectedSlot].client} />
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span style={{ background: activeSchedule[selectedSlot].status === "softblocked" ? "#EDE7F6" : "#F3E5F5", color: activeSchedule[selectedSlot].status === "softblocked" ? "#5E35B1" : "#7B1FA2", padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
              {activeSchedule[selectedSlot].status === "softblocked" ? "Soft Block — Can Train Here If Needed" : "Blocked — Personal Time"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="✏️" label="Change Block" desc="Pick a different label" color="#F3E5F5" borderColor="#CE93D8" onClick={() => setPanelMode("block-select")} />
            <ActionButton icon="👤" label="Replace with Client" desc="Open this slot for a session" color="#E3F2FD" borderColor="#90CAF9" onClick={() => { clearSlot(selectedSlot); setPanelMode("assign"); }} />
            <ActionButton icon="🗑" label="Clear Block" desc="Open this slot up" color="#F5F5F5" borderColor="#E0E0E0" onClick={() => { clearSlot(selectedSlot); closePanel(); }} />
          </div>
        </Overlay>
      )}

      {invoiceClient && (
        <InvoicePanel clientName={invoiceClient} client={clients.find(c => c.name === invoiceClient)} onClose={() => setInvoiceClient(null)} />
      )}
    </>
  );
}

// ===================== SUNDAY SEND VIEW =====================
function SundaySendView({ schedule, weekLabel, notes, setNotes, sent, setSent, nextSchedule, nextWeekLabel, nextNotes, setNextNotes, nextSent, setNextSent, clients }) {
  const [sendWeek, setSendWeek] = useState("current");
  const isNextWeek = sendWeek === "next" && nextSchedule;
  const activeSchedule = isNextWeek ? nextSchedule : schedule;
  const activeWeekLabel = isNextWeek ? nextWeekLabel : weekLabel;
  const activeNotes = isNextWeek ? (nextNotes || {}) : notes;
  const setActiveNotes = isNextWeek ? setNextNotes : setNotes;
  const activeSent = isNextWeek ? nextSent : sent;
  const setActiveSent = isNextWeek ? setNextSent : setSent;

  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState(null);
  const [filter, setFilter] = useState("all");

  const clientSessions = {};
  Object.entries(activeSchedule).forEach(([key, val]) => {
    if (val.status === "cancelled" || val.status === "blocked" || val.status === "softblocked") return;
    const [day, time] = key.split("-");
    if (!clientSessions[val.client]) clientSessions[val.client] = [];
    clientSessions[val.client].push({ day: day.slice(0,3), time: val.customTime || time });
  });

  const activeClients = clients.filter(c => clientSessions[c.name]?.length > 0);
  const filtered = activeClients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "sent") return activeSent.has(c.name);
    if (filter === "unsent") return !activeSent.has(c.name);
    return true;
  });

  const buildMessage = (client, note) => {
    const firstName = client.name.split(" ")[0].split("&")[0].trim();
    const sessions = clientSessions[client.name] || [];
    const noteText = note?.trim() ? ` ${note.trim()}` : "";
    const weekRef = isNextWeek ? "next week" : "this week";
    if (sessions.length === 1) return `Hey ${firstName}!${noteText} You're on for ${sessions[0].day} at ${sessions[0].time} ${weekRef}. Let me know if anything changes!`;
    const times = sessions.map(s => `${s.day} ${s.time}`).join(", ");
    return `Hey ${firstName}!${noteText} Here's ${weekRef} — ${times}. Let me know if anything needs to shift!`;
  };

  const handleSend = (client) => {
    const message = buildMessage(client, activeNotes[client.name]);
    window.open(`sms:${client.phone}&body=${encodeURIComponent(message)}`, "_blank");
    setActiveSent(prev => new Set([...prev, client.name]));
    setExpandedClient(null);
  };

  const sentCount = activeSent.size;
  const totalCount = activeClients.length;
  const pct = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #1a1a2e, #16213e)", padding: "20px 16px 14px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.5, fontWeight: 600 }}>Sunday Send</div>
            <h1 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>Week of {activeWeekLabel}</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{sentCount}/{totalCount}</div>
            <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>sent</div>
          </div>
        </div>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 5, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sentCount === totalCount ? "#4CAF50" : "#64B5F6", borderRadius: 6, transition: "width 0.4s" }} />
        </div>

        {/* Week toggle */}
        {nextSchedule && (
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={() => setSendWeek("current")} style={{
              flex: 1, padding: "6px 0", borderRadius: 8, border: sendWeek === "current" ? "2px solid white" : "1px solid rgba(255,255,255,0.2)",
              background: sendWeek === "current" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              color: "white", fontSize: 11, fontWeight: sendWeek === "current" ? 700 : 400, cursor: "pointer",
            }}>This Week</button>
            <button onClick={() => setSendWeek("next")} style={{
              flex: 1, padding: "6px 0", borderRadius: 8, border: sendWeek === "next" ? "2px solid white" : "1px solid rgba(255,255,255,0.2)",
              background: sendWeek === "next" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              color: "white", fontSize: 11, fontWeight: sendWeek === "next" ? 700 : 400, cursor: "pointer",
            }}>Next Week</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {["all", "unsent", "sent"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${filter === f ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 20, color: "white", padding: "4px 12px", fontSize: 11, fontWeight: filter === f ? 700 : 400, cursor: "pointer", textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 16px" }}>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #E0DED8", fontSize: 14, background: "white", boxSizing: "border-box", marginBottom: 6 }} />

        {filtered.map(client => {
          const isSent = activeSent.has(client.name);
          const isExp = expandedClient === client.name;
          const note = activeNotes[client.name] || "";
          const firstName = client.name.split(" ")[0].split("&")[0].trim();

          return (
            <div key={client.name} style={{ background: "white", borderRadius: 12, marginTop: 6, border: `1px solid ${isSent ? "#C8E6C9" : "#E8E6E1"}`, overflow: "hidden", opacity: isSent && filter === "all" ? 0.6 : 1 }}>
              <div onClick={() => setExpandedClient(isExp ? null : client.name)}
                style={{ display: "flex", alignItems: "center", padding: "10px 12px", cursor: "pointer", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: isSent ? "#E8F5E9" : "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: `2px solid ${isSent ? "#66BB6A" : "#90CAF9"}`, flexShrink: 0, color: isSent ? "#2E7D32" : "#1565C0" }}>
                  {isSent ? "✓" : firstName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{client.name}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{(clientSessions[client.name] || []).map(s => `${s.day} ${s.time}`).join(" · ")}</div>
                </div>
                <div style={{ fontSize: 11, color: "#CCC", transform: isExp ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
              </div>
              {isExp && (
                <div style={{ padding: "0 12px 12px", borderTop: "1px solid #F0EEE9" }}>
                  <textarea value={note} onChange={e => setActiveNotes(prev => ({ ...prev, [client.name]: e.target.value }))}
                    placeholder="Personal note (optional)..." style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8, border: "1px solid #E0DED8", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 36, boxSizing: "border-box", background: "#FAFAF8" }} />
                  <div style={{ marginTop: 8, padding: 12, borderRadius: 14, background: "#E8F5E9", fontSize: 13, lineHeight: 1.5, borderBottomLeftRadius: 4 }}>{buildMessage(client, note)}</div>
                  <button onClick={() => handleSend(client)} style={{
                    width: "100%", marginTop: 8, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
                    background: isSent ? "#E8F5E9" : "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: isSent ? "#2E7D32" : "white",
                  }}>{isSent ? "✓ Sent — Send Again?" : "Open in Messages →"}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ===================== CLIENTS VIEW =====================
function ClientsView({ clients, setClients, schedule }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showTopUp, setShowTopUp] = useState(null);
  const [invoiceClient, setInvoiceClient] = useState(null);

  const sessionCounts = {};
  Object.values(schedule).forEach(({ client, status }) => { if (status !== "blocked" && status !== "softblocked") sessionCounts[client] = (sessionCounts[client] || 0) + 1; });

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const updatePhone = (name, phone) => {
    setClients(prev => prev.map(c => c.name === name ? { ...c, phone } : c));
    setEditing(null);
  };

  const addSessions = (name, amount) => {
    setClients(prev => prev.map(c => c.name === name ? { ...c, used: 0, purchased: amount } : c));
    setShowTopUp(null);
  };

  const lowBalanceClients = clients.filter(c => ((c.purchased || 30) - (c.used || 0)) <= 3);

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2C3E6B 100%)", padding: "20px 16px 14px", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Client Roster</h1>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{clients.length} clients</div>
      </div>

      {/* Low balance alert */}
      {lowBalanceClients.length > 0 && (
        <div style={{ margin: "10px 16px 0", padding: "10px 12px", background: "#FFF3E0", border: "1px solid #FFE0B2", borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E65100", marginBottom: 4 }}>⚠ Low Balance ({lowBalanceClients.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {lowBalanceClients.map(c => {
              const remaining = (c.purchased || 30) - (c.used || 0);
              return (
                <span key={c.name} onClick={() => setShowTopUp(c.name)} style={{
                  background: remaining <= 0 ? "#FFCDD2" : "#FFE0B2",
                  color: remaining <= 0 ? "#C62828" : "#E65100",
                  padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: "pointer",
                }}>{c.name}: {c.used}/{c.purchased}</span>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ padding: "10px 16px" }}>
        <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #E0DED8", fontSize: 14, background: "white", boxSizing: "border-box", marginBottom: 8 }} />
        {filtered.map(c => {
          const count = sessionCounts[c.name] || 0;
          const isEditing = editing === c.name;
          const isTopUp = showTopUp === c.name;
          const bal = c.used || 0;
          const pur = c.purchased || 30;
          const remaining = pur - bal;
          const balColor = remaining <= 0 ? "#C62828" : remaining <= 3 ? "#E65100" : "#1B5E20";
          const balBg = remaining <= 0 ? "#FFCDD2" : remaining <= 3 ? "#FFE0B2" : "#C8E6C9";
          return (
            <div key={c.name} style={{ background: "white", borderRadius: 10, marginBottom: 4, border: `1px solid ${remaining <= 0 ? "#EF9A9A" : remaining <= 3 ? "#FFE082" : "#EEE"}`, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    {c.name}
                    {c.duration === 25 && <span style={{ fontSize: 9, background: "#F3E5F5", color: "#7B1FA2", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>25m</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{c.type === "fixed" ? "Fixed" : "Flex"} · {c.sessions}x/wk</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ background: count >= c.sessions ? "#C8E6C9" : count > 0 ? "#FFE0B2" : "#FFCDD2", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: count >= c.sessions ? "#1B5E20" : count > 0 ? "#E65100" : "#B71C1C" }}>{count}/{c.sessions}</div>
                  <div onClick={() => setShowTopUp(isTopUp ? null : c.name)} style={{ background: balBg, borderRadius: 8, padding: "4px 8px", fontSize: 12, fontWeight: 800, color: balColor, cursor: "pointer", minWidth: 44, textAlign: "center" }}
                    title="Sessions used / purchased — tap to manage">
                    {bal}/{pur}
                  </div>
                </div>
              </div>

              {/* Top-up buttons */}
              {isTopUp && (
                <div style={{ marginTop: 8, padding: "8px 0", borderTop: "1px solid #F0F0F0" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6 }}>Used {bal} of {pur} sessions{remaining <= 0 ? " — needs to repurchase!" : ""}</div>

                  {/* Editable fields */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>Used</label>
                      <input type="number" value={bal} onChange={e => { const v = parseInt(e.target.value) || 0; setClients(prev => prev.map(cl => cl.name === c.name ? { ...cl, used: Math.max(0, v) } : cl)); }}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1.5px solid #90CAF9", fontSize: 14, fontWeight: 700, textAlign: "center", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 6, fontSize: 16, fontWeight: 700, color: "#AAA" }}>/</div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>Purchased</label>
                      <input type="number" value={pur} onChange={e => { const v = parseInt(e.target.value) || 0; setClients(prev => prev.map(cl => cl.name === c.name ? { ...cl, purchased: Math.max(1, v) } : cl)); }}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1.5px solid #90CAF9", fontSize: 14, fontWeight: 700, textAlign: "center", boxSizing: "border-box" }} />
                    </div>
                  </div>

                  {/* Quick new package buttons */}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1B2A4A", marginBottom: 4 }}>New package (resets used to 0):</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 10, 20, 30].map(n => (
                      <button key={n} onClick={() => addSessions(c.name, n)} style={{
                        flex: 1, padding: "8px 4px", borderRadius: 8, border: "1.5px solid #1B2A4A",
                        background: "white", color: "#1B2A4A", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1B2A4A"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#1B2A4A"; }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => { setClients(prev => prev.map(cl => cl.name === c.name ? { ...cl, used: Math.max(0, bal - 1) } : cl)); }}
                      style={{ flex: 1, padding: "6px", borderRadius: 8, border: "1px solid #90CAF9", background: "#E3F2FD", color: "#1565C0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      −1
                    </button>
                    <button onClick={() => { setClients(prev => prev.map(cl => cl.name === c.name ? { ...cl, used: Math.min(pur, bal + 1) } : cl)); }}
                      style={{ flex: 1, padding: "6px", borderRadius: 8, border: "1px solid #FFE082", background: "#FFF8E1", color: "#E65100", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      +1
                    </button>
                    <button onClick={() => setShowTopUp(null)}
                      style={{ flex: 1, padding: "6px", borderRadius: 8, border: "1px solid #DDD", background: "#F5F5F5", color: "#888", fontSize: 11, cursor: "pointer" }}>
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div onClick={() => setEditing(c.name)} style={{ marginTop: 6, cursor: "pointer" }}>
                {isEditing ? (
                  <input autoFocus value={c.phone} onChange={e => updatePhone(c.name, e.target.value)}
                    onBlur={() => setEditing(null)} onKeyDown={e => e.key === "Enter" && setEditing(null)}
                    placeholder="Enter phone number..."
                    style={{ width: "100%", padding: "4px 8px", borderRadius: 6, border: "1px solid #90CAF9", fontSize: 12, boxSizing: "border-box" }} />
                ) : (
                  <div style={{ fontSize: 11, color: c.phone ? "#555" : "#CCC", padding: "4px 0" }}>
                    {c.phone || "Tap to add phone number"}
                  </div>
                )}
              </div>

              {/* Invoice button */}
              <button onClick={() => setInvoiceClient(c.name)} style={{
                width: "100%", marginTop: 6, padding: "7px", borderRadius: 8,
                border: `1.5px solid ${remaining <= 3 ? "#EF9A9A" : "#90CAF9"}`,
                background: remaining <= 3 ? "#FFF3E0" : "#F5F9FF",
                color: remaining <= 3 ? "#E65100" : "#1565C0",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                💳 {remaining <= 3 ? `Send Invoice (${remaining} left!)` : "Send Invoice"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice Panel */}
      {invoiceClient && (
        <InvoicePanel
          clientName={invoiceClient}
          client={clients.find(c => c.name === invoiceClient)}
          onClose={() => setInvoiceClient(null)}
        />
      )}
    </>
  );
}

// ===================== HISTORY VIEW =====================
function HistoryView({ weekHistory, setWeekHistory, clients, onLoad }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const deleteWeek = (idx) => {
    if (confirm("Delete this archived week?")) {
      setWeekHistory(prev => prev.filter((_, i) => i !== idx));
      setExpandedIdx(null);
    }
  };

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2C3E6B 100%)", padding: "20px 16px 14px", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Week History</h1>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{weekHistory.length} week{weekHistory.length !== 1 ? "s" : ""} archived</div>
      </div>
      <div style={{ padding: "10px 16px" }}>
        {weekHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#AAA" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 14 }}>No weeks archived yet</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>When you tap "+ New Week" on the schedule, the current week gets saved here automatically.</div>
          </div>
        )}
        {weekHistory.map((entry, idx) => {
          const isExp = expandedIdx === idx;
          const schedEntries = Object.entries(entry.schedule).filter(([_, v]) => v.status !== "blocked" && v.status !== "softblocked");

          return (
            <div key={idx} style={{ background: "white", borderRadius: 12, marginBottom: 8, border: "1px solid #E8E6E1", overflow: "hidden" }}>
              {/* Header */}
              <div onClick={() => setExpandedIdx(isExp ? null : idx)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1B2A4A" }}>Week of {entry.weekLabel}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {entry.confirmedCount}/{entry.sessionCount} confirmed · saved {new Date(entry.savedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#CCC", transform: isExp ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
              </div>

              {/* Expanded: show schedule summary and actions */}
              {isExp && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid #F0EEE9" }}>
                  {/* Day-by-day summary */}
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => {
                    const dayEntries = schedEntries
                      .filter(([k]) => k.startsWith(day))
                      .sort(([a], [b]) => a.localeCompare(b));
                    if (!dayEntries.length) return null;
                    return (
                      <div key={day} style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1B2A4A", marginBottom: 3 }}>{day}</div>
                        {dayEntries.map(([key, val]) => {
                          const time = val.customTime || key.split("-")[1];
                          const statusIcon = val.status === "confirmed" ? "✓" : val.status === "cancelled" ? "✗" : "?";
                          const statusColor = val.status === "confirmed" ? "#1B5E20" : val.status === "cancelled" ? "#B71C1C" : "#E65100";
                          return (
                            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0", fontSize: 12 }}>
                              <span style={{ color: "#555" }}>{time} — {val.client}</span>
                              <span style={{ color: statusColor, fontWeight: 700, fontSize: 11 }}>{statusIcon}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={() => onLoad(entry)} style={{
                      flex: 1, padding: "10px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white",
                    }}>Load This Week</button>
                    <button onClick={() => deleteWeek(idx)} style={{
                      padding: "10px 16px", borderRadius: 8, border: "1px solid #EF9A9A", background: "#FFEBEE", color: "#C62828", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>Delete</button>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 10, color: "#AAA", marginTop: 4 }}>Loading replaces your current schedule</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ===================== INVOICE PANEL =====================
function InvoicePanel({ clientName, client, onClose }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [customNote, setCustomNote] = useState("");
  const groupType = getGroupType(clientName);
  const packages = client ? getPackagesForClient(client) : PKG_PERSONAL;
  const bal = client?.used || 0;
  const pur = client?.purchased || 30;
  const remaining = pur - bal;

  // Group packages by category
  const categories = {};
  packages.forEach(pkg => {
    if (!categories[pkg.cat]) categories[pkg.cat] = [];
    categories[pkg.cat].push(pkg);
  });

  const getDivisor = (pkg) => pkg.split || (groupType === "couple" ? 2 : groupType === "trio" ? 3 : 1);
  const getClientPrice = (pkg) => { const d = getDivisor(pkg); return d > 1 ? Math.round(pkg.price / d) : pkg.price; };

  const handleSend = () => {
    if (!selectedPkg || !client?.phone) return;
    let msg = buildInvoiceText(clientName, selectedPkg, groupType);
    if (customNote.trim()) msg = msg.replace("time to re-up!", `time to re-up! ${customNote.trim()}`);
    window.open(`sms:${client.phone}&body=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ width: 40, height: 4, background: "#DDD", borderRadius: 2, margin: "0 auto 10px" }} />
        <div style={{ fontWeight: 800, fontSize: 16, color: "#1B2A4A" }}>Invoice for {clientName}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{bal}/{pur} used · {remaining} remaining</div>
        {groupType === "couple" && <div style={{ fontSize: 11, color: "#7B1FA2", fontWeight: 600, marginTop: 4 }}>👥 Couple — each client billed 50%</div>}
        {groupType === "trio" && <div style={{ fontSize: 11, color: "#7B1FA2", fontWeight: 600, marginTop: 4 }}>👥 Group of 3 — each client billed 1/3</div>}
      </div>

      {/* Package selection grouped by category */}
      <div style={{ maxHeight: "40vh", overflow: "auto", marginBottom: 12 }}>
        {Object.entries(categories).map(([cat, pkgs]) => (
          <div key={cat} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, padding: "4px 8px", background: "#F5F5F0", borderRadius: 6 }}>{cat}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {pkgs.map(pkg => {
                const isSel = selectedPkg === pkg;
                const clientPrice = getClientPrice(pkg);
                const divisor = getDivisor(pkg);
                const hasSplit = divisor > 1;
                return (
                  <button key={pkg.label} onClick={() => setSelectedPkg(pkg)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
                    background: isSel ? "#1B2A4A" : "white",
                    color: isSel ? "white" : "#1a1a1a",
                    border: `1.5px solid ${isSel ? "#1B2A4A" : "#DDD"}`,
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{pkg.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>
                        {pkg.monthly ? "monthly" : `$${Math.round(clientPrice / pkg.count)}/session`}
                        {hasSplit && !isSel && <span> · full: ${pkg.price.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>${clientPrice.toLocaleString()}{pkg.monthly ? <span style={{ fontSize: 10, opacity: 0.7 }}>/mo</span> : ""}</div>
                      {hasSplit && <div style={{ fontSize: 9, opacity: 0.7 }}>{divisor === 2 ? "per person" : "each (1/3)"}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom note + preview + send */}
      {selectedPkg && (
        <>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>Personal note (optional)</label>
            <textarea value={customNote} onChange={e => setCustomNote(e.target.value)}
              placeholder="E.g. Great progress this month!"
              style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 40, boxSizing: "border-box", background: "#FAFAF8" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>Message preview</label>
            <div style={{ marginTop: 4, padding: 12, borderRadius: 14, background: "#E8F5E9", fontSize: 13, lineHeight: 1.5, borderBottomLeftRadius: 4, whiteSpace: "pre-line" }}>
              {(() => {
                let msg = buildInvoiceText(clientName, selectedPkg, groupType);
                if (customNote.trim()) msg = msg.replace("time to re-up!", `time to re-up! ${customNote.trim()}`);
                return msg;
              })()}
            </div>
          </div>

          <button onClick={handleSend} style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
            background: client?.phone ? "linear-gradient(135deg, #1B2A4A, #2C3E6B)" : "#E0E0E0",
            color: client?.phone ? "white" : "#999",
          }}>
            {client?.phone ? "Open in Messages →" : "Add phone number first"}
          </button>
        </>
      )}
    </Overlay>
  );
}

// ===================== SHARED COMPONENTS =====================
function Overlay({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: "16px 16px 0 0", width: "100%", maxWidth: 420, maxHeight: "80vh", overflow: "auto", padding: 16 }} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}
function PanelHeader({ slot, subtitle }) {
  const [day, time] = slot.split("-");
  return (
    <div style={{ textAlign: "center", marginBottom: 14 }}>
      <div style={{ width: 40, height: 4, background: "#DDD", borderRadius: 2, margin: "0 auto 10px" }} />
      <div style={{ fontWeight: 800, fontSize: 16, color: "#1B2A4A" }}>{day} · {time}</div>
      {subtitle && <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}
function ActionButton({ icon, label, desc, color, borderColor, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: color, border: `1.5px solid ${borderColor}`, cursor: "pointer", textAlign: "left", width: "100%" }}>
      <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{icon}</span>
      <div><div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div><div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{desc}</div></div>
    </button>
  );
}
function Pill({ label, color, textColor = "#1a1a1a" }) {
  return <span style={{ background: color, color: textColor, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}
