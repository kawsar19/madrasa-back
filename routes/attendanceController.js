const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const authenticateToken = require("../middlewares/authCheck");
const { attendanceSchema } = require("../helper/validation");

// Your middleware or authentication checks could be added here if needed

router.post("/create-single", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { madrasa } = req.user;
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const existingAttendance = await Attendance.findOne({
      student: req.body.studentId,
      studentClass: req.body.classId,
      date: req.body.date,
    });

    if (existingAttendance) {
      return res.status(400).json({
        error:
          "Attendance already recorded for this student on the given date and class",
      });
    }

    const attendance = new Attendance({
      student: req.body.studentId,
      madrasa: madrasa,
      studentClass: req.body.classId,
      date: req.body.date,
      status: req.body.status,
    });

    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.post("/create-multiple", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { madrasa } = req.user;
    const attendanceRecords = req.body.attendanceRecords; // Assuming the request body contains an array of attendance records

    // Validate each attendance record in the array
    for (const record of attendanceRecords) {
      const { error } = attendanceSchema.validate(record);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    }

    // Extracting unique student IDs to check for existing attendance
    const studentIds = attendanceRecords.map((record) => record.studentId);
    const existingAttendances = await Attendance.find({
      student: { $in: studentIds },
      date: { $in: attendanceRecords.map((record) => record.date) },
    });

    if (existingAttendances.length > 0) {
      const existingStudents = existingAttendances.map((attendance) =>
        attendance.student.toString()
      );
      const existingDates = existingAttendances.map(
        (attendance) => attendance.date.toISOString().split("T")[0]
      );
      const existingEntries = existingAttendances.map((attendance) => ({
        studentId: attendance.student.toString(),
        date: attendance.date.toISOString().split("T")[0],
      }));

      const duplicateEntries = attendanceRecords.filter(
        (record) =>
          existingStudents.includes(record.studentId) &&
          existingDates.includes(record.date.toISOString().split("T")[0])
      );

      return res.status(400).json({
        error:
          "Attendance already recorded for some students on specific dates",
        duplicateEntries,
      });
    }

    // Prepare attendance objects for insertion
    const newAttendances = attendanceRecords.map((record) => ({
      student: record.studentId,
      madrasa: madrasa,
      studentClass: record.classId,
      date: record.date,
      status: record.status,
    }));

    // Insert multiple attendance records at once using insertMany
    const createdAttendances = await Attendance.insertMany(newAttendances);

    res.status(201).json(createdAttendances);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get(
  "/student-attendance/:studentId",
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log(req.query);

      const { studentId } = req.params;
      const { month, year } = req.query;

      // Validate month and year if needed

      // Fetch attendance records for the specified student in the given month and year
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Set the time to the end of the day automatically (i.e., 23:59:59)

      const studentAttendance = await Attendance.find({
        student: studentId,
        date: { $gte: startDate, $lte: endDate },
      });

      res.status(200).json(studentAttendance);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
