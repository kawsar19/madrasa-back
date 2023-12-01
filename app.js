const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/vadira', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Madrasa Schema and Model (Replace 'path-to-your-madrasa-model' with the actual path)
const Madrasa = require('./models/Madrasa');

// Require Madrasa Routes (Replace 'path-to-your-madrasa-routes' with the actual path)
const madrasaRoutes = require('./routes/madrasaController');
const teacherRoute = require('./routes/teacherController');
const studentRoutes = require('./routes/studentController');
const classRoutes = require('./routes/classController');


// Use Madrasa Routes
app.use('/api/madrasa', madrasaRoutes);
app.use('/api/teacher',teacherRoute);
app.use('/api/student',studentRoutes);
app.use('/api/class',classRoutes);

app.get((req,res)=>{
  res.send("wworking");
})
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
