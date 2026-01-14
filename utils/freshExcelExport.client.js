"use client";

/**
 * IMPORTANT:
 * - This file MUST be client-side only
 * - XLSX is dynamically imported
 */

export const exportFreshExcel = async (logs, leaves) => {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  /* ---------------- ATTENDANCE SUMMARY ---------------- */

  const grouped = {};

  logs.forEach((l) => {
    // We intentionally ignore raw SHIFT rows
    const key = `${l.empId}_${l.date}`;

    if (!grouped[key]) {
      grouped[key] = {
        date: l.date,
        empId: l.empId,
        empName: l.empName,
        login: null,
        logout: null,
        breakMinutes: 0,
      };
    }

    const row = grouped[key];

    if (l.action === "SHIFT_START" && !row.login) {
      row.login = l.time;
    }

    if (l.action === "SHIFT_END") {
      row.logout = l.time;
    }

    if (l.action === "BREAK_END" && l.details) {
      const mins = parseInt(l.details.match(/\d+/)?.[0] || 0);
      row.breakMinutes += mins;
    }
  });

  const attendanceRows = Object.values(grouped).map((r) => {
    let net = "";

    if (r.login && r.logout) {
      const start = new Date(`1970-01-01 ${r.login}`);
      const end = new Date(`1970-01-01 ${r.logout}`);

      let mins = (end - start) / 60000 - r.breakMinutes;
      mins = Math.max(0, Math.round(mins));

      const h = Math.floor(mins / 60);
      const m = mins % 60;

      net = `${h}h ${m}m`;
    }

    return {
      Date: r.date,
      "Employee ID": r.empId,
      "Employee Name": r.empName,
      "Login Time": r.login || "",
      "Logout Time": r.logout || "",
      "Total Break (min)": r.breakMinutes,
      "Net Working Hours": net,
    };
  });

  const ws1 = XLSX.utils.json_to_sheet(attendanceRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Attendance Summary");

  /* ---------------- LEAVE RECORDS ---------------- */

  const leaveRows = leaves.map((l) => ({
    "Employee ID": l.empId,
    "Employee Name": l.empName,
    "From Date": l.from,
    "To Date": l.to,
    Reason: l.reason,
    "Applied On": l.appliedOn,
  }));

  const ws2 = XLSX.utils.json_to_sheet(leaveRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Leave Records");

  /* ---------------- SAVE FILE ---------------- */

  XLSX.writeFile(
    wb,
    `NTS_Attendance_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
