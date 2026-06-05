require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const path      = require('path');

const videoRoutes = require('./routes/videoRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Database 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => { console.error('  MongoDB error:', err); process.exit(1); });

// View engine 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes 
app.use('/', videoRoutes);

//404 
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ── Global error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Server Error', message: err.message });
});

app.listen(PORT, () =>
  console.log(` Videx running at http://localhost:${PORT}`)
);
