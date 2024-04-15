const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }))
  

mongoose.connect('mongodb+srv://api:gWbUnYOWrqhH4k3B@discord-bot-yt.x47ufxi.mongodb.net/?retryWrites=true&w=majority&appName=discord-bot-yt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const Question = mongoose.model('Question', {
    guildId: String,
    userId: String,
    userName: String,
    question: String,
    time: String,
});

app.get('/api/data', (req, res) => {
    Question.find()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.delete('/api/questions/:_id', async (req, res) => {
    try {
      const _id = req.params._id;
      await Question.findByIdAndDelete(_id);
      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});