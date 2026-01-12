const express = require('express');
const app = express();
const cors = require('cors');

require('./db');

const authRoutes = require('./routes/authRoutes');
const mockAuth = require('./middlewares/mockAuth');
const programRoutes = require('./routes/programRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

app.use(mockAuth); // 👈 TEMP AUTH

app.use('/cms/programs', programRoutes);
app.use('/catalog', catalogRoutes);

module.exports = app;
