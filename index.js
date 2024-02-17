const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://kawsarbinjahangir:mWIlmJjfHvxBTJpC@cluster0.ngiowav.mongodb.net/school",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Madrasa Schema and Model (Replace 'path-to-your-madrasa-model' with the actual path)
const Madrasa = require("./models/Madrasa");

// Require Madrasa Routes (Replace 'path-to-your-madrasa-routes' with the actual path)
const madrasaRoutes = require("./routes/madrasaController");
const teacherRoute = require("./routes/teacherController");
const studentRoutes = require("./routes/studentController");
const classRoutes = require("./routes/classController");
const paymentRoutes = require("./routes/paymentConroller");
const prayerRoutes = require("./routes/prayerRoutes");
const attendanceRoutes = require("./routes/attendanceController");
const monthlyBillType = require("./routes/monthlyBillTypeController");


// Use Madrasa R
app.use("/api/madrasa", madrasaRoutes);
app.use("/api/teacher", teacherRoute);
app.use("/api/student", studentRoutes);
app.use("/api/class", classRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/prayer", prayerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/monthlybilltype", monthlyBillType);

app.get("/test", (req, res) => {
  res.send("This is a test endpoint!");
});
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
