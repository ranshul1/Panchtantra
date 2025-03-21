const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const userRoutes = require('./routes/userRoutes'); // Import user routes
const storyRoutes = require('./routes/storyRoutes'); // Import story routes
const MongoDBStore = require('connect-mongodb-session')(session);
// Load environment variables
dotenv.config();
mongoose.set('strictQuery', false);
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React app URL
  credentials: true, // Allow session cookies
}));
app.use(cookieParser());
app.use(express.json());

// MongoDB Connection
mongoose.set('strictQuery', true); // Avoid deprecation warnings in Mongoose 7+
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
})
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });

// Session middleware
//const MongoDBStore = require('connect-mongodb-session')(session);

// Create MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions', // Collection name for storing sessions
});

// Handle session store errors
store.on('error', (error) => {
  console.error('Session store error:', error);
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret', // Use a secure secret
  resave: false,
  saveUninitialized: false,
  store: store, // Use MongoDB session store
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 3600000000, // 1 hour
  },
}));

  

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/stories', storyRoutes); // Mount story routes

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
