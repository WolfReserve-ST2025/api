const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./src/routes/authRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Test route
app.get('/', (req, res) => {
    res.send('Hello from WolfReserve backend!');
});



app.use('/api/auth', authRoutes);

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/rooms', require('./routes/roomRoutes'));
// app.use('/api/foods', require('./routes/foodRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));


module.exports = app;