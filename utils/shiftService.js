// /utils/shiftService.js

import { sendShiftStartEmail, sendShiftEndEmail } from "./emailService";
import { db } from "../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const DAILY_COLLECTION = "attendanceDaily";

// 🔒 ONE SOURCE OF TRUTH FOR DOC ID
const getDocId = (empId, date) => `${empId}_${date}`;

/* ================================
   START SHIFT
================================ */
export const startShiftService = async ({
  empId,
  empName,
  empEmail,
  setShiftStarted,
  setShiftStartTime,
  setAttendanceData,
  setEmailStatus,
  notificationSettings,
}) => {
  try {
    if (!empId || !empName) {
      alert("Please select an employee first");
      return;
    }

    // 🔒 ALWAYS USE ISO
    const now = new Date();
    const isoNow = now.toISOString();
    const date = isoNow.slice(0, 10); // YYYY-MM-DD

    // UI STATE
    setShiftStarted(true);
    setShiftStartTime(isoNow); // ✅ ISO STRING ONLY

    // 🔥 SAVE TO FIRESTORE (LIVE)
    await setDoc(
      doc(db, DAILY_COLLECTION, getDocId(empId, date)),
      {
        empId,
        empName,
        date,
        shiftStartTime: isoNow,
        shiftEndTime: null,
        totalBreakMinutes: 0,
        totalWorkingMinutes: 0,
        status: "Active",
        updatedAt: isoNow,
      },
      { merge: true }
    );

    // UI DATA (optional)
    setAttendanceData?.((prev) => [
      ...prev,
      {
        employeeId: empId,
        employeeName: empName,
        date,
        startTime: isoNow,
        endTime: null,
        totalBreakTime: 0,
        status: "Active",
      },
    ]);

    // EMAIL
    if (notificationSettings?.shiftStart && empEmail) {
      try {
        await sendShiftStartEmail(empEmail, empName);
        setEmailStatus?.("✅ Shift start email sent");
      } catch (e) {
        console.error("Email error:", e);
      }
    }

    alert(`✅ Shift started for ${empName}`);
  } catch (error) {
    console.error("Error starting shift:", error);
    alert("Failed to start shift. Please try again.");
  }
};

/* ================================
   END SHIFT
================================ */
export const endShiftService = async ({
  empId,
  empName,
  empEmail,
  shiftStarted,
  shiftStartTime, // 🔒 MUST BE ISO STRING
  totalBreakTime,
  setShiftStarted,
  setShiftStartTime,
  setTotalBreakTime,
  setActiveBreak,
  setAttendanceData,
  setEmailStatus,
  notificationSettings,
}) => {
  try {
    if (!shiftStarted || !shiftStartTime) {
      alert("Shift has not been started");
      return;
    }

    // 🔒 ONE TIME SOURCE
    const endISO = new Date().toISOString();
    const date = endISO.slice(0, 10);

    const start = new Date(shiftStartTime);
    const end = new Date(endISO);

    // 🔒 SAFE CALCULATION (CANNOT GO NEGATIVE)
    let workedMinutes =
      (end.getTime() - start.getTime()) / 60000 -
      (totalBreakTime || 0);

    workedMinutes = Math.max(0, Math.round(workedMinutes));

    const hours = Math.floor(workedMinutes / 60);
    const minutes = workedMinutes % 60;
    const durationText = `${hours}h ${minutes}m`;

    // 🔥 UPDATE FIRESTORE (THIS FIXES EXCEL)
    await updateDoc(
      doc(db, DAILY_COLLECTION, getDocId(empId, date)),
      {
        shiftEndTime: endISO,
        totalBreakMinutes: totalBreakTime || 0,
        totalWorkingMinutes: workedMinutes,
        status: "Completed",
        updatedAt: endISO,
      }
    );

    // UI UPDATE
    setAttendanceData?.((prev) =>
      prev.map((entry) =>
        entry.employeeId === empId && entry.date === date
          ? {
              ...entry,
              endTime: endISO,
              totalBreakTime,
              workingHours: (workedMinutes / 60).toFixed(2),
              status: "Completed",
            }
          : entry
      )
    );

    // RESET STATE
    setShiftStarted(false);
    setShiftStartTime(null);
    setTotalBreakTime(0);
    setActiveBreak(null);

    // EMAIL
    if (notificationSettings?.shiftEnd && empEmail) {
      try {
        await sendShiftEndEmail(empEmail, empName, durationText);
        setEmailStatus?.("✅ Shift end email sent");
      } catch (e) {
        console.error("Email error:", e);
      }
    }

    alert(
      `✅ Shift ended for ${empName}\nWorking time: ${durationText}\nBreaks: ${totalBreakTime} min`
    );
  } catch (error) {
    console.error("Error ending shift:", error);
    alert("Failed to end shift. Please try again.");
  }
};
