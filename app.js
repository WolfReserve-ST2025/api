const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const foodRoutes = require('./src/routes/foodRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const path = require('path');

const roomRoutes = require('./src/routes/roomRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Test route
app.get('/', (req, res) => {
    res.send('Hello from WolfReserve backend!');
});

app.use('/api/uploads/foods', express.static(path.join(__dirname, 'src/uploads/foods')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);


module.exports = app;