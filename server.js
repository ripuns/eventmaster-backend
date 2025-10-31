const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
  secret: 'Web-Project-eventManagementSystem', // use env variable in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));


mongoose.connect('mongodb+srv://vishrutram25_db_user:7VA32465Bwx2tsCV@cluster0.zqjmjld.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Default route to serve login.html (or index.html)
app.get('/', (req, res) => {
  res.send("backend is live");
  // res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// ✅ Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
