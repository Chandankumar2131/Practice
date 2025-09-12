import React, { useEffect, useState, useRef } from "react";

// Single-file React component
// Features:
// - Add / remove birthdays (name + date)
// - Persists to localStorage
// - Shows upcoming birthdays sorted by nearest date
// - Shows days remaining and age turning
// - Uses the Notifications API (falls back to alert)
// - Checks for birthdays on mount and every hour

export default function BirthdayReminder() {
  const [people, setPeople] = useState(() => {
    try {
      const raw = localStorage.getItem("birthday_reminder_people");
      return raw ? JSON.parse(raw) : sampleData();
    } catch (e) {
      return sampleData();
    }
  });

  const nameRef = useRef(null);
  const dateRef = useRef(null);
  const [q, setQ] = useState("");
  const [notifyDaysAhead, setNotifyDaysAhead] = useState(0);

  useEffect(() => {
    localStorage.setItem("birthday_reminder_people", JSON.stringify(people));
  }, [people]);

  // Ask for notification permission on load
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check birthdays now and then every hour
  useEffect(() => {
    checkBirthdaysAndNotify();
    const id = setInterval(checkBirthdaysAndNotify, 1000 * 60 * 60); // every hour
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people, notifyDaysAhead]);

  function sampleData() {
    return [
      { id: genId(), name: "Ami Patel", date: "1998-09-20" },
      { id: genId(), name: "Ravi Kumar", date: "2000-12-05" },
    ];
  }

  function genId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addPerson(e) {
    e.preventDefault();
    const name = nameRef.current.value.trim();
    const date = dateRef.current.value;
    if (!name || !date) return;

    setPeople((p) => [...p, { id: genId(), name, date }]);
    nameRef.current.value = "";
    dateRef.current.value = "";
  }

  function removePerson(id) {
    setPeople((p) => p.filter((x) => x.id !== id));
  }

  function daysUntilNextBirthday(birthDateStr) {
    const now = new Date();
    const b = new Date(birthDateStr);
    // use this year's birthday
    const thisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (thisYear < startOfDay(now)) {
      // already passed this year -> next year
      return diffDays(thisYear, startOfDay(now)) + 365 - (isLeapYear(now.getFullYear()) && b.getMonth() > 1 ? 1 : 0);
    }
    return diffDays(thisYear, startOfDay(now));
  }

  function diffDays(a, b) {
    //: a - b in days (assumes a >= b)
    const _MS = 1000 * 60 * 60 * 24;
    return Math.round((a - b) / _MS);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isLeapYear(y) {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  }

  function checkBirthdaysAndNotify() {
    const now = new Date();
    const todayStart = startOfDay(now);

    people.forEach((p) => {
      const b = new Date(p.date);
      const thisYearBirthday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
      const daysLeft = diffDays(thisYearBirthday, todayStart);

      // Normalize when birthday already passed this year
      const normalizedDaysLeft = daysLeft >= 0 ? daysLeft : diffDays(new Date(now.getFullYear() + 1, b.getMonth(), b.getDate()), todayStart);

      if (normalizedDaysLeft === notifyDaysAhead) {
        notify(`Birthday reminder: ${p.name} has a birthday in ${notifyDaysAhead} day${notifyDaysAhead !== 1 ? "s" : ""}`);
      }

      if (normalizedDaysLeft === 0) {
        const age = now.getFullYear() - b.getFullYear();
        notify(`🎉 Today is ${p.name}'s birthday! Turning ${age}`);
      }
    });
  }

  function notify(message) {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(message);
    } else {
      // fallback
      try {
        // don't spam alerts during checks if user hasn't allowed notifications
        console.log("Notification fallback:", message);
        // small visual fallback: browser alert (commented out to avoid being intrusive)
        // alert(message);
      } catch (e) {
        // noop
      }
    }
  }

  // helper to format upcoming list
  function upcomingList() {
    const now = new Date();
    const todayStart = startOfDay(now);
    return people
      .map((p) => {
        const b = new Date(p.date);
        const thisYear = new Date(now.getFullYear(), b.getMonth(), b.getDate());
        const daysLeft = diffDays(thisYear, todayStart);
        const normalizedDaysLeft = daysLeft >= 0 ? daysLeft : diffDays(new Date(now.getFullYear() + 1, b.getMonth(), b.getDate()), todayStart);
        const ageTurning = now.getFullYear() - b.getFullYear() + (normalizedDaysLeft === 0 ? 0 : 1);
        return { ...p, daysLeft: normalizedDaysLeft, ageTurning };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  const filtered = upcomingList().filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/60 backdrop-blur rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Birthday Reminder</h1>
        <p className="text-sm mb-4">Add birthdays and get notified the day-of or a few days ahead.</p>

        <form onSubmit={addPerson} className="flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs">Name</label>
            <input ref={nameRef} className="w-full p-2 rounded border" placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs">Date</label>
            <input ref={dateRef} type="date" className="p-2 rounded border" />
          </div>
          <div>
            <button className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Add</button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs">Notify days ahead:</label>
            <input
              type="number"
              value={notifyDaysAhead}
              onChange={(e) => setNotifyDaysAhead(Math.max(0, Math.min(30, Number(e.target.value || 0))))}
              className="w-16 p-2 rounded border"
              min={0}
              max={30}
            />
          </div>
        </form>

        <div className="mt-4 flex gap-2 items-center">
          <input
            placeholder="Search by name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 p-2 rounded border"
          />
          <button
            onClick={() => {
              // quick demo: add today's date for testing
              const today = new Date();
              const yyyy = today.getFullYear();
              const mm = String(today.getMonth() + 1).padStart(2, "0");
              const dd = String(today.getDate()).padStart(2, "0");
              setPeople((p) => [...p, { id: genId(), name: "Test Birthday", date: `${yyyy}-${mm}-${dd}` }]);
            }}
            className="px-3 py-2 rounded border"
          >
            Add Test
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Upcoming</h2>
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500">No birthdays added yet.</p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-white/60 dark:bg-slate-900/40">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-slate-500">
                      {new Date(p.date).toLocaleDateString()} • In {p.daysLeft} day{p.daysLeft !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-600">Turns {p.ageTurning}</div>
                    <button onClick={() => removePerson(p.id)} className="px-3 py-1 rounded border text-sm">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          <strong>How notifications work:</strong> This demo requests the browser's Notification permission. If denied, the app falls back to console logging. Set "Notify days ahead" to 0 to be notified on the birthday itself.
        </div>

        <div className="mt-4 text-right text-xs text-slate-400">Built with ❤️ — single-file demo</div>
      </div>
    </div>
  );
}
