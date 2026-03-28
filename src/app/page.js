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
  { name: "Greg Pierce", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Kirksey Taylor", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Nate Garber", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Jack Palms", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "David Spika", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Paulo", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Ana Ambrosi", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Marnie", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Rachael & Lindsay", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Rick", type: "fixed", sessions: 2, duration: 25, phone: "", used: 10, purchased: 30 },
  { name: "Melanie Paul", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Ryan Young", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Ryan Culpepper", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Andrew Welker", type: "flex", sessions: 3, phone: "", used: 10, purchased: 30 },
  { name: "Madison Palms", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Candy Streit", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Aric McCumber", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Kasey Moore", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Patti", type: "fixed", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Kate McCumber", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Jacque", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Brandon Crow", type: "flex", sessions: 2, phone: "", used: 10, purchased: 30 },
  { name: "Jill Harvey", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Susan Crow", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Autumn Moss", type: "fixed", sessions: 3, duration: 25, phone: "", used: 10, purchased: 30 },
  { name: "Cole Crow", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Lane Crow", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Leah & Leigh Johnson", type: "fixed", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Nicole Stewart", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Jack Charles", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Kate & Jill Harvey", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
  { name: "Molly & Brooke", type: "flex", sessions: 1, phone: "", used: 10, purchased: 30 },
];

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
  const [clients, setClients] = useState(CLIENTS);
  const [weekLabel, setWeekLabel] = useState(getMonday);
  const [sundayNotes, setSundayNotes] = useState({});
  const [sundaySent, setSundaySent] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const saved = loadData("pt-schedule", null);
    const savedWeek = loadData("pt-week", null);
    const savedClients = loadData("pt-clients", null);
    const savedNotes = loadData("pt-sunday-notes", null);
    const savedSent = loadData("pt-sunday-sent", null);
    if (saved) setSchedule(saved);
    if (savedWeek) setWeekLabel(savedWeek);
    if (savedClients) setClients(savedClients);
    if (savedNotes) setSundayNotes(savedNotes);
    if (savedSent) setSundaySent(new Set(savedSent));
    setLoaded(true);
  }, []);

  // Save on every change
  useEffect(() => { if (loaded) saveData("pt-schedule", schedule); }, [schedule, loaded]);
  useEffect(() => { if (loaded) saveData("pt-week", weekLabel); }, [weekLabel, loaded]);
  useEffect(() => { if (loaded) saveData("pt-clients", clients); }, [clients, loaded]);
  useEffect(() => { if (loaded) saveData("pt-sunday-notes", sundayNotes); }, [sundayNotes, loaded]);
  useEffect(() => { if (loaded) saveData("pt-sunday-sent", [...sundaySent]); }, [sundaySent, loaded]);

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "system-ui" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#F5F5F0", minHeight: "100vh", color: "#1a1a1a", paddingBottom: 70 }}>
      {appView === "schedule" && (
        <ScheduleView schedule={schedule} setSchedule={setSchedule} clients={clients} setClients={setClients} weekLabel={weekLabel} setWeekLabel={setWeekLabel} />
      )}
      {appView === "send" && (
        <SundaySendView schedule={schedule} clients={clients} notes={sundayNotes} setNotes={setSundayNotes} sent={sundaySent} setSent={setSundaySent} weekLabel={weekLabel} />
      )}
      {appView === "clients" && (
        <ClientsView clients={clients} setClients={setClients} schedule={schedule} />
      )}

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #E0E0E0", display: "flex", zIndex: 90 }}>
        {[
          { key: "schedule", icon: "📅", label: "Schedule" },
          { key: "send", icon: "💬", label: "Sunday Send" },
          { key: "clients", icon: "👥", label: "Clients" },
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
function ScheduleView({ schedule, setSchedule, clients, setClients, weekLabel, setWeekLabel }) {
  const [panelMode, setPanelMode] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [editingWeek, setEditingWeek] = useState(false);
  const [selectedOpenSlots, setSelectedOpenSlots] = useState([]);
  const [rescheduleNote, setRescheduleNote] = useState("");

  const scheduledClients = new Set(Object.values(schedule).filter(s => s.status !== "blocked" && s.status !== "softblocked").map(s => s.client));
  const unscheduled = clients.filter(c => !scheduledClients.has(c.name));
  const sessionCounts = {};
  Object.values(schedule).forEach(({ client, status }) => { if (status !== "blocked" && status !== "softblocked") sessionCounts[client] = (sessionCounts[client] || 0) + 1; });
  const totalSessions = Object.values(schedule).filter(s => s.status !== "blocked" && s.status !== "softblocked").length;
  const confirmedCount = Object.values(schedule).filter(s => s.status === "confirmed").length;
  const pendingCount = Object.values(schedule).filter(s => s.status === "pending").length;
  const blockedCount = Object.values(schedule).filter(s => s.status === "blocked" || s.status === "softblocked").length;
  const { open: openSlots, softBlocked: softBlockedSlots } = getOpenSlots(schedule, clients);
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
    const entry = schedule[key];
    if (entry && (entry.status === "blocked" || entry.status === "softblocked")) {
      setPanelMode("block-actions");
    } else if (entry) {
      setPanelMode("actions");
    } else {
      setPanelMode("empty-actions");
    }
  };
  const [customBlockLabel, setCustomBlockLabel] = useState("");
  const [editTimeValue, setEditTimeValue] = useState("");
  const assignClient = (name) => { setSchedule(prev => ({ ...prev, [selectedSlot]: { client: name, status: "pending" } })); closePanel(); };
  const clearSlot = (key) => setSchedule(prev => { const n = { ...prev }; delete n[key]; return n; });
  const cycleStatus = (key, e) => {
    e.stopPropagation();
    const entry = schedule[key]; if (!entry) return;
    const order = ["confirmed", "pending", "cancelled"];
    const oldStatus = entry.status;
    const newStatus = order[(order.indexOf(oldStatus) + 1) % 3];
    // Count up: add 1 when confirming, subtract 1 when un-confirming
    if (newStatus === "confirmed" && oldStatus !== "confirmed") adjustUsed(entry.client, 1);
    if (oldStatus === "confirmed" && newStatus !== "confirmed") adjustUsed(entry.client, -1);
    setSchedule(prev => ({ ...prev, [key]: { ...prev[key], status: newStatus } }));
  };
  const closePanel = () => { setPanelMode(null); setSelectedSlot(null); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); };

  const buildRescheduleText = () => {
    const entry = schedule[selectedSlot]; if (!entry) return "";
    const firstName = entry.client.split(" ")[0].split("&")[0].trim();
    const [origDay, origTime] = selectedSlot.split("-");
    const displayTime = entry.customTime || origTime;
    const slotsText = selectedOpenSlots.map(s => s.label).join(", ");
    const noteText = rescheduleNote.trim() ? ` ${rescheduleNote.trim()}` : "";
    if (selectedOpenSlots.length === 1) return `Hey ${firstName}!${noteText} How about ${selectedOpenSlots[0].label} instead of ${shortDay(origDay)} ${displayTime}? Let me know!`;
    return `Hey ${firstName}!${noteText} No worries on ${shortDay(origDay)} ${displayTime} — I've got a few openings: ${slotsText}. Which works best for you?`;
  };

  const handleSendReschedule = () => {
    const entry = schedule[selectedSlot]; if (!entry) return;
    const client = clients.find(c => c.name === entry.client);
    window.open(`sms:${client?.phone || ""}&body=${encodeURIComponent(buildRescheduleText())}`, "_blank");
    setSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], status: "cancelled" } }));
    closePanel();
  };

  const handleConfirmReschedule = (newKey) => {
    const entry = schedule[selectedSlot]; if (!entry) return;
    setSchedule(prev => { const n = { ...prev }; n[newKey] = { client: entry.client, status: "confirmed" }; delete n[selectedSlot]; return n; });
    closePanel();
  };

  const toggleOpenSlot = (slot) => {
    setSelectedOpenSlots(prev => {
      if (prev.find(s => s.key === slot.key)) return prev.filter(s => s.key !== slot.key);
      if (prev.length >= 3) return prev;
      return [...prev, slot];
    });
  };

  const newWeek = () => {
    if (confirm("Start a new week? This will copy your current schedule forward with all sessions set to pending.")) {
      // Copy current schedule, reset all client sessions to pending, keep blocks as-is
      const newSched = {};
      Object.entries(schedule).forEach(([key, entry]) => {
        if (entry.status === "blocked" || entry.status === "softblocked") {
          newSched[key] = { ...entry };
        } else if (entry.status !== "cancelled") {
          newSched[key] = { ...entry, status: "pending" };
        }
        // cancelled sessions are dropped — they don't carry forward
      });
      setSchedule(newSched);
      // Advance week label by 7 days
      try {
        const d = new Date(weekLabel);
        if (!isNaN(d.getTime())) {
          d.setDate(d.getDate() + 7);
          setWeekLabel(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        } else {
          setWeekLabel(weekLabel + " (next)");
        }
      } catch(e) {
        setWeekLabel(weekLabel + " (next)");
      }
      // Reset Sunday Send tracking for the new week
      saveData("pt-sunday-sent", []);
    }
  };

  const handleDrop = (targetKey, dragKey) => {
    if (!dragKey || dragKey === targetKey) return;
    setSchedule(prev => {
      const next = { ...prev }; const dd = next[dragKey]; const td = next[targetKey];
      if (dd && td) { next[dragKey] = td; next[targetKey] = dd; }
      else if (dd) { next[targetKey] = dd; delete next[dragKey]; }
      return next;
    });
  };

  const [dragItem, setDragItem] = useState(null);

  return (
    <>
      <div style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2C3E6B 100%)", padding: "16px 20px 12px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Weekly Schedule</h1>
            {editingWeek ? (
              <input autoFocus value={weekLabel} onChange={e => setWeekLabel(e.target.value)}
                onBlur={() => setEditingWeek(false)} onKeyDown={e => e.key === "Enter" && setEditingWeek(false)}
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 8px", fontSize: 14, fontWeight: 600, marginTop: 4 }} />
            ) : (
              <span onClick={() => setEditingWeek(true)} style={{ fontSize: 14, opacity: 0.9, cursor: "pointer", borderBottom: "1px dashed rgba(255,255,255,0.4)" }}>Week of {weekLabel}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Pill label={`${totalSessions}`} color="#81C784" />
            <Pill label={`${confirmedCount} ✓`} color="#C8E6C9" textColor="#1B5E20" />
            <Pill label={`${pendingCount} ?`} color="#FFE0B2" textColor="#E65100" />
            {blockedCount > 0 && <Pill label={`${blockedCount} 🚫`} color="#E1BEE7" textColor="#4A148C" />}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={newWeek} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "white", padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>+ New Week</button>
        </div>
      </div>

      <div style={{ padding: "12px 8px", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "54px repeat(5, 1fr)", gap: 2 }}>
          <div />
          {DAYS.map((day, i) => (
            <div key={day} style={{ background: "#1B2A4A", color: "white", textAlign: "center", padding: "5px 2px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
              {day.slice(0, 3)}<div style={{ fontSize: 8, opacity: 0.7, fontWeight: 400 }}>{day === "Friday" ? "→ 3:30" : "→ 7 PM"}</div>
            </div>
          ))}
          {ALL_TIMES.map(time => {
            // Check if any day in this row has a 25-min client — if so we need a gap sub-row
            const has25 = DAYS.some(day => {
              const entry = schedule[`${day}-${time}`];
              if (!entry || entry.status === "blocked" || entry.status === "softblocked") return false;
              const ci = clients.find(c => c.name === entry.client);
              return ci?.duration === 25;
            });
            // Also check if any day has an entry in the gap slot
            const hasGapEntry = DAYS.some(day => schedule[`${day}-${time}-gap`]);

            return (
              <>
                {/* Main row */}
                <div key={`t-${time}`} style={{ fontSize: 9, fontWeight: 600, color: "#555", display: "flex", alignItems: "center", justifyContent: "center", minHeight: has25 ? 32 : 42 }}>{time}</div>
                {DAYS.map(day => {
                  const key = `${day}-${time}`; const isAvail = DAY_SLOTS[day].includes(time); const entry = schedule[key];
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

                {/* Gap sub-row: only show if any day in this row has a 25-min client or a gap entry */}
                {(has25 || hasGapEntry) && (
                  <>
                    <div key={`g-${time}`} style={{ fontSize: 7, fontWeight: 600, color: "#AAA", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 24, fontStyle: "italic" }}>
                      {/* Show the gap time based on the first 25-min entry found in this row */}
                      {(() => {
                        for (const d of DAYS) {
                          const e = schedule[`${d}-${time}`];
                          if (e && e.status !== "blocked" && e.status !== "softblocked") {
                            const c = clients.find(cl => cl.name === e.client);
                            if (c?.duration === 25) return calcGapTime(e.customTime || time);
                          }
                        }
                        return "gap";
                      })()}
                    </div>
                    {DAYS.map(day => {
                      const mainKey = `${day}-${time}`;
                      const gapKey = `${day}-${time}-gap`;
                      const isAvail = DAY_SLOTS[day].includes(time);
                      const mainEntry = schedule[mainKey];
                      const gapEntry = schedule[gapKey];
                      const mainClient = mainEntry ? clients.find(c => c.name === mainEntry.client) : null;
                      const mainIs25 = mainClient?.duration === 25;
                      const gapStartTime = mainIs25 ? calcGapTime(mainEntry?.customTime || time) : "";

                      if (!isAvail) return <div key={gapKey} style={{ background: "#ECEFF1", borderRadius: 3, minHeight: 24, opacity: 0.3 }} />;

                      // If main slot is a 25-min session, show the gap as bookable
                      if (mainIs25 && !gapEntry) {
                        return (
                          <div key={gapKey}
                            onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                            onClick={() => { setSelectedSlot(gapKey); setSearch(""); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); setPanelMode("empty-actions"); }}
                            style={{ background: "#F0FFF0", border: "1px dashed #A5D6A7", borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#C8E6C9"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#F0FFF0"; }}>
                            <span style={{ fontSize: 7, color: "#66BB6A", fontWeight: 600 }}>OFF {gapStartTime}</span>
                            <span style={{ fontSize: 6, color: "#81C784" }}>tap to book</span>
                          </div>);
                      }

                      // If there's a gap entry (someone booked in the gap)
                      if (gapEntry) {
                        if (gapEntry.status === "blocked" || gapEntry.status === "softblocked") {
                          return (
                            <div key={gapKey} draggable onDragStart={() => setDragItem(gapKey)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                              onClick={() => { setSelectedSlot(gapKey); setSearch(""); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); setPanelMode("block-actions"); }}
                              style={{ background: gapEntry.status === "blocked" ? "#E1BEE7" : "#D1C4E9", border: `1px solid ${gapEntry.status === "blocked" ? "#AB47BC" : "#9575CD"}`, borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1px 3px", cursor: "grab" }}>
                              <div style={{ fontSize: 7, fontWeight: 700, color: "#4A148C" }}>{gapEntry.client}</div>
                            </div>);
                        }
                        const gs = STATUS_COLORS[gapEntry.status] || STATUS_COLORS.pending;
                        const gci = clients.find(c => c.name === gapEntry.client);
                        return (
                          <div key={gapKey} draggable onDragStart={() => setDragItem(gapKey)} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }}
                            onClick={() => { setSelectedSlot(gapKey); setSearch(""); setSelectedOpenSlots([]); setRescheduleNote(""); setCustomBlockLabel(""); setPanelMode("actions"); }}
                            style={{ background: gs.bg, border: `1px solid ${gs.border}`, borderRadius: 4, minHeight: 24, display: "flex", flexDirection: "column", justifyContent: "center", padding: "1px 3px", cursor: "grab" }}>
                            <div style={{ fontSize: 7, fontWeight: 700, color: gs.text, opacity: 0.6 }}>{gapEntry.customTime || "gap"}{gci?.duration === 25 ? " · 25m" : ""}</div>
                            <div style={{ fontSize: 8, fontWeight: 600, color: gs.text }}>{gapEntry.client}</div>
                          </div>);
                      }

                      // No 25-min session in this column, just show empty/collapsed gap
                      return <div key={gapKey} onDragOver={e => e.preventDefault()} onDrop={() => { handleDrop(gapKey, dragItem); setDragItem(null); }} style={{ background: "#F9F9F6", borderRadius: 3, minHeight: 24, opacity: 0.3 }} />;
                    })}
                  </>
                )}
              </>
            );
          })}
        </div>

        {unscheduled.length > 0 && (
          <div style={{ marginTop: 14, background: "white", borderRadius: 8, padding: 10, border: "1px solid #E0E0E0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1565C0", marginBottom: 6 }}>Unscheduled ({unscheduled.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {unscheduled.map(c => (
                <span key={c.name} style={{ background: c.type === "fixed" ? "#E8F5E9" : "#FFF8E1", border: `1px solid ${c.type === "fixed" ? "#A5D6A7" : "#FFE082"}`, borderRadius: 10, padding: "2px 8px", fontSize: 10, fontWeight: 500 }}>
                  {c.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Panels */}
      {panelMode === "actions" && selectedSlot && schedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={schedule[selectedSlot].client} />
          {schedule[selectedSlot].customTime && (
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <span style={{ background: "#E3F2FD", color: "#1565C0", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>Actual start: {schedule[selectedSlot].customTime}</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="⏱" label="Edit Start Time" desc={schedule[selectedSlot].customTime ? `Currently ${schedule[selectedSlot].customTime}` : "Set actual start time"} color="#E8EAF6" borderColor="#9FA8DA"
              onClick={() => { setEditTimeValue(schedule[selectedSlot].customTime || ""); setPanelMode("edit-time"); }} />
            <ActionButton icon="🔄" label="Reschedule" desc="Pick open slots & text options" color="#E3F2FD" borderColor="#90CAF9"
              onClick={() => { setPanelMode("reschedule"); setSelectedOpenSlots([]); setRescheduleNote(""); }} />
            <ActionButton icon="↔" label="Move Slot" desc="Reassign without texting" color="#FFF8E1" borderColor="#FFE082"
              onClick={() => setPanelMode("assign")} />
            <ActionButton icon="✕" label="Cancel" desc="Mark as cancelled" color="#FFEBEE" borderColor="#EF9A9A"
              onClick={() => { setSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], status: "cancelled" } })); closePanel(); }} />
            <ActionButton icon="🗑" label="Clear" desc="Remove from schedule" color="#F5F5F5" borderColor="#E0E0E0"
              onClick={() => { clearSlot(selectedSlot); closePanel(); }} />
          </div>
        </Overlay>
      )}

      {/* EDIT START TIME */}
      {panelMode === "edit-time" && selectedSlot && schedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`${schedule[selectedSlot].client} — Edit Start Time`} />
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10, textAlign: "center" }}>
            Slot is in the {selectedSlot.split("-")[1]} row. Set the actual start time:
          </div>
          <input
            autoFocus
            value={editTimeValue}
            onChange={e => setEditTimeValue(e.target.value)}
            placeholder="e.g. 6:25 AM, 9:05 AM, 1:15 PM"
            onKeyDown={e => {
              if (e.key === "Enter") {
                setSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], customTime: editTimeValue.trim() || undefined } }));
                closePanel();
              }
            }}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #9FA8DA", fontSize: 16, textAlign: "center", boxSizing: "border-box", fontWeight: 600 }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => {
              setSchedule(prev => ({ ...prev, [selectedSlot]: { ...prev[selectedSlot], customTime: editTimeValue.trim() || undefined } }));
              closePanel();
            }} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white",
            }}>Save</button>
            {schedule[selectedSlot].customTime && (
              <button onClick={() => {
                setSchedule(prev => { const n = { ...prev }; const e = { ...n[selectedSlot] }; delete e.customTime; n[selectedSlot] = e; return n; });
                closePanel();
              }} style={{
                padding: "12px 16px", borderRadius: 10, border: "1px solid #EF9A9A", background: "#FFEBEE", color: "#C62828", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Reset to {selectedSlot.split("-")[1]}</button>
            )}
          </div>
        </Overlay>
      )}

      {panelMode === "reschedule" && selectedSlot && schedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`Reschedule ${schedule[selectedSlot].client}`} />
          <div style={{ fontSize: 12, color: "#666", marginBottom: 10, textAlign: "center" }}>Tap 2-3 slots to offer as alternatives</div>
          <div style={{ maxHeight: "45vh", overflow: "auto", marginBottom: 12 }}>
            {/* PRIMARY: Open slots */}
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

            {/* SECONDARY: Soft-blocked (programming) slots */}
            {softBlockedSlots.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#5E35B1", marginBottom: 6, marginTop: 12, padding: "4px 8px", background: "#EDE7F6", borderRadius: 6 }}>Can Book Over (Programming Time)</div>
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
                            background: isSel ? "#5E35B1" : "#EDE7F6", color: isSel ? "white" : "#5E35B1",
                            border: `1.5px solid ${isSel ? "#5E35B1" : "#B39DDB"}`,
                          }}>{slot.time} {isSel && "✓"}</button>;
                        })}
                      </div>
                    </div>);
                })}
              </>
            )}
          </div>
          {selectedOpenSlots.length > 0 && (
            <button onClick={() => setPanelMode("reschedule-text")} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white" }}>
              Preview Text →</button>
          )}
          {selectedOpenSlots.length === 1 && (
            <button onClick={() => handleConfirmReschedule(selectedOpenSlots[0].key)} style={{ width: "100%", padding: 10, marginTop: 8, borderRadius: 8, border: "1px solid #C8E6C9", background: "#E8F5E9", color: "#1B5E20", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Move to {selectedOpenSlots[0].label} (no text)</button>
          )}
        </Overlay>
      )}

      {panelMode === "reschedule-text" && selectedSlot && schedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={`Text ${schedule[selectedSlot].client}`} />
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>Personal note</label>
            <textarea value={rescheduleNote} onChange={e => setRescheduleNote(e.target.value)} placeholder="E.g. No worries at all!"
              style={{ width: "100%", marginTop: 4, padding: 10, borderRadius: 8, border: "1px solid #E0E0E0", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 44, boxSizing: "border-box", background: "#FAFAF8" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>Preview</label>
            <div style={{ marginTop: 4, padding: 12, borderRadius: 14, background: "#E8F5E9", fontSize: 14, lineHeight: 1.6, borderBottomLeftRadius: 4 }}>{buildRescheduleText()}</div>
          </div>
          <button onClick={handleSendReschedule} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg, #1B2A4A, #2C3E6B)", color: "white" }}>
            Open in Messages →</button>
          <button onClick={() => setPanelMode("reschedule")} style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 8, border: "1px solid #DDD", background: "#F5F5F5", color: "#666", fontSize: 12, cursor: "pointer" }}>← Back</button>
        </Overlay>
      )}

      {panelMode === "assign" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={schedule[selectedSlot]?.client ? `Replace ${schedule[selectedSlot].client}` : "Assign client"} />
          <input autoFocus placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #DDD", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: "50vh", overflow: "auto" }}>
            {filteredClients.map(c => {
              const count = sessionCounts[c.name] || 0;
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

      {/* EMPTY SLOT ACTIONS — assign client or block time */}
      {panelMode === "empty-actions" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle="What do you need here?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="👤" label="Assign Client" desc="Schedule a training session" color="#E3F2FD" borderColor="#90CAF9"
              onClick={() => setPanelMode("assign")} />
            <ActionButton icon="🚫" label="Block Time" desc="Personal time — can't be scheduled over" color="#F3E5F5" borderColor="#CE93D8"
              onClick={() => setPanelMode("block-select")} />
          </div>
        </Overlay>
      )}

      {/* BLOCK TIME SELECTION — pick preset or custom */}
      {panelMode === "block-select" && selectedSlot && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle="Block this time for..." />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {BLOCK_PRESETS.map(preset => (
              <button key={preset.label} onClick={() => {
                const status = preset.bookable ? "softblocked" : "blocked";
                setSchedule(prev => ({ ...prev, [selectedSlot]: { client: `${preset.icon} ${preset.label}`, status } }));
                closePanel();
              }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                background: preset.bookable ? "#EDE7F6" : "#F3E5F5",
                border: `1.5px solid ${preset.bookable ? "#B39DDB" : "#CE93D8"}`,
                cursor: "pointer", textAlign: "left", width: "100%",
              }}>
                <span style={{ fontSize: 18 }}>{preset.icon}</span>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#4A148C" }}>{preset.label}</span>
                  {preset.bookable && <div style={{ fontSize: 10, color: "#7E57C2", marginTop: 1 }}>Can be booked over if needed</div>}
                </div>
              </button>
            ))}
            {/* Custom block */}
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>OR CUSTOM</div>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={customBlockLabel} onChange={e => setCustomBlockLabel(e.target.value)}
                  placeholder="E.g. Doctor appt, Errands..."
                  onKeyDown={e => { if (e.key === "Enter" && customBlockLabel.trim()) { setSchedule(prev => ({ ...prev, [selectedSlot]: { client: customBlockLabel.trim(), status: "blocked" } })); closePanel(); }}}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #CE93D8", fontSize: 13, boxSizing: "border-box" }} />
                <button onClick={() => {
                  if (customBlockLabel.trim()) {
                    setSchedule(prev => ({ ...prev, [selectedSlot]: { client: customBlockLabel.trim(), status: "blocked" } }));
                    closePanel();
                  }
                }} style={{
                  padding: "8px 16px", borderRadius: 8, border: "none", background: customBlockLabel.trim() ? "#AB47BC" : "#E0E0E0",
                  color: customBlockLabel.trim() ? "white" : "#999", fontWeight: 700, fontSize: 13, cursor: customBlockLabel.trim() ? "pointer" : "default",
                }}>Block</button>
              </div>
            </div>
          </div>
        </Overlay>
      )}

      {/* BLOCKED SLOT ACTIONS — edit or clear */}
      {panelMode === "block-actions" && selectedSlot && schedule[selectedSlot] && (
        <Overlay onClose={closePanel}>
          <PanelHeader slot={selectedSlot} subtitle={schedule[selectedSlot].client} />
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <span style={{
              background: schedule[selectedSlot].status === "softblocked" ? "#D1C4E9" : "#E1BEE7",
              color: "#4A148C", padding: "4px 14px", borderRadius: 12, fontSize: 13, fontWeight: 700
            }}>
              {schedule[selectedSlot].status === "softblocked" ? "Soft Block — Can Train Here If Needed" : "Blocked — Personal Time"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionButton icon="✏️" label="Change Block" desc="Pick a different label" color="#F3E5F5" borderColor="#CE93D8"
              onClick={() => setPanelMode("block-select")} />
            <ActionButton icon="👤" label="Replace with Client" desc="Open this slot for a session" color="#E3F2FD" borderColor="#90CAF9"
              onClick={() => { clearSlot(selectedSlot); setPanelMode("assign"); }} />
            <ActionButton icon="🗑" label="Clear Block" desc="Open this slot up" color="#F5F5F5" borderColor="#E0E0E0"
              onClick={() => { clearSlot(selectedSlot); closePanel(); }} />
          </div>
        </Overlay>
      )}
    </>
  );
}

// ===================== SUNDAY SEND VIEW =====================
function SundaySendView({ schedule, clients, notes, setNotes, sent, setSent, weekLabel }) {
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState(null);
  const [filter, setFilter] = useState("unsent");

  const clientSessions = {};
  Object.entries(schedule).forEach(([key, val]) => {
    if (val.status === "cancelled" || val.status === "blocked" || val.status === "softblocked") return;
    const [day, time] = key.split("-");
    if (!clientSessions[val.client]) clientSessions[val.client] = [];
    clientSessions[val.client].push({ day: day.slice(0,3), time: val.customTime || time });
  });

  const activeClients = clients.filter(c => clientSessions[c.name]?.length > 0);
  const filtered = activeClients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "sent") return sent.has(c.name);
    if (filter === "unsent") return !sent.has(c.name);
    return true;
  });

  const buildMessage = (client, note) => {
    const firstName = client.name.split(" ")[0].split("&")[0].trim();
    const sessions = clientSessions[client.name] || [];
    const noteText = note?.trim() ? ` ${note.trim()}` : "";
    if (sessions.length === 1) return `Hey ${firstName}!${noteText} You're on for ${sessions[0].day} at ${sessions[0].time} this week. Let me know if anything changes!`;
    const times = sessions.map(s => `${s.day} ${s.time}`).join(", ");
    return `Hey ${firstName}!${noteText} Here's this week — ${times}. Let me know if anything needs to shift!`;
  };

  const handleSend = (client) => {
    const message = buildMessage(client, notes[client.name]);
    window.open(`sms:${client.phone}&body=${encodeURIComponent(message)}`, "_blank");
    setSent(prev => new Set([...prev, client.name]));
    setExpandedClient(null);
  };

  const sentCount = sent.size;
  const totalCount = activeClients.length;
  const pct = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #1a1a2e, #16213e)", padding: "20px 16px 14px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.5, fontWeight: 600 }}>Sunday Send</div>
            <h1 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>Week of {weekLabel}</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{sentCount}/{totalCount}</div>
            <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>sent</div>
          </div>
        </div>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 5, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: sentCount === totalCount ? "#4CAF50" : "#64B5F6", borderRadius: 6, transition: "width 0.4s" }} />
        </div>
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
          const isSent = sent.has(client.name);
          const isExp = expandedClient === client.name;
          const note = notes[client.name] || "";
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
                  <div style={{ marginTop: 10 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>PERSONAL NOTE</label>
                    <textarea value={note} onChange={e => setNotes(prev => ({ ...prev, [client.name]: e.target.value }))}
                      placeholder={`Personal touch for ${firstName}...`}
                      style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #E0DED8", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 40, boxSizing: "border-box", background: "#FAFAF8" }} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>PREVIEW</label>
                    <div style={{ marginTop: 4, padding: 10, borderRadius: 12, background: "#E8F5E9", fontSize: 13, lineHeight: 1.5, borderBottomLeftRadius: 4 }}>
                      {buildMessage(client, note)}
                    </div>
                  </div>
                  <button onClick={() => handleSend(client)} style={{
                    width: "100%", marginTop: 8, padding: "10px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    background: isSent ? "#E8E8E8" : "linear-gradient(135deg, #1a1a2e, #16213e)", color: isSent ? "#888" : "white",
                  }}>{isSent ? "✓ Resend" : `Send to ${firstName} →`}</button>
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
            </div>
          );
        })}
      </div>
    </>
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
