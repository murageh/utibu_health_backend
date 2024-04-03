const express = require('express');
const routes = require('./routes/api');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sync db
const sequelize = require('./config/database');
sequelize.sync({alter: true})
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Unable to sync database:', err);
    });

// Routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// default route
app.get('/', (req, res) => {
    res.send('Welcome to the Pharmacy API');
});
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});