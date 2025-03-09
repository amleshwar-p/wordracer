const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define a schema for the leaderboard
const leaderboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
});

// Define a model for the leaderboard
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// API Routes
app.get('/api/leaderboard', async (req, res) => {
    try {
        const scores = await Leaderboard.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

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

// ❌ REMOVE `app.listen()` (Vercel handles it)
module.exports = app;
// app.listen(port, () => console.log(`Server running on port ${port}`));
