<<<<<<<< HEAD:api/index.cjs
// api/index.cjs
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
========
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
>>>>>>>> d474dda (Database fixed):api/server.cjs

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB connection (you can leave as is)
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Leaderboard schema and model
const leaderboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
});
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

<<<<<<<< HEAD:api/index.cjs
// GET leaderboard endpoint
========
// API Routes
>>>>>>>> d474dda (Database fixed):api/server.cjs
app.get('/api/leaderboard', async (req, res) => {
    try {
        const scores = await Leaderboard.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

<<<<<<<< HEAD:api/index.cjs
// POST to save score endpoint
========
>>>>>>>> d474dda (Database fixed):api/server.cjs
app.post('/api/leaderboard', async (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).json({ msg: 'Please provide both name and score' });
    }
    try {
        const newScore = new Leaderboard({ name, score });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

<<<<<<<< HEAD:api/index.cjs
// For local testing only:
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

// Export the app for Vercel
module.exports = app;
========
// ❌ REMOVE `app.listen()` (Vercel handles it)
module.exports = app;
// app.listen(port, () => console.log(`Server running on port ${port}`));
>>>>>>>> d474dda (Database fixed):api/server.cjs
