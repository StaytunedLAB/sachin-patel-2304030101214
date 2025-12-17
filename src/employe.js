// Employee Attendance Processing System
function processAttendance(attendance) {
  let result = {
    employeeId: attendance.employeeId || "Unknown",
    date: attendance.date || "Unknown",
    status: "complete",
    totalWorkingMinutes: 0,
    overtimeMinutes: 0,
    note: "",
    error: null
  };

  try {
    if (!attendance.checkIn || !attendance.checkOut) {
      result.status = "incomplete";
      result.note = "Missing check-in or check-out time.";
      return result;
    }

    // Parse time strings (HH:MM)
    function parseTime(timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid time format");
      return hours * 60 + minutes; // total minutes
    }

    let checkInMinutes = parseTime(attendance.checkIn);
    let checkOutMinutes = parseTime(attendance.checkOut);

    // Calculate break duration
    let breakMinutes = 0;
    if (attendance.break) {
      try {
        if (attendance.break.start && attendance.break.end) {
          let breakStart = parseTime(attendance.break.start);
          let breakEnd = parseTime(attendance.break.end);
          breakMinutes = breakEnd - breakStart;
          if (breakMinutes < 0) breakMinutes = 30; // default break
        } else {
          breakMinutes = 30; // default break
        }
      } catch {
        breakMinutes = 30; // fallback default break
      }
    }

    let workingMinutes = checkOutMinutes - checkInMinutes - breakMinutes;
    if (workingMinutes < 0) {
      result.status = "invalid";
      result.note = "Total working minutes calculated negative.";
      workingMinutes = 0;
    }

    result.totalWorkingMinutes = workingMinutes;

    // Overtime calculation
    if (attendance.overtimeApproved && workingMinutes > 480) {
      result.overtimeMinutes = workingMinutes - 480;
    }

    result.note = "Attendance processed successfully";

  } catch (err) {
    result.status = "error";
    result.error = err.message;
    result.note = "Error occurred while processing attendance";
  } finally {
    console.log("Attendance processed successfully");
  }

  return result;
}

// Example usage
const attendance1 = {
  employeeId: "E001",
  date: "2025-12-17",
  checkIn: "09:00",
  checkOut: "18:30",
  break: { start: "13:00", end: "13:45" },
  overtimeApproved: true
};

console.log(processAttendance(attendance1));
