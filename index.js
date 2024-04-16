const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

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

const questionSchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    userName: String,
    question: String,
    time: String
});

const questionSchema2 = new mongoose.Schema({
    guildId: String,
    userId: String,
    userName: String,
    question: String,
    time: String,
    del_time: String
});

const Question = mongoose.model('Question', questionSchema);
const newQuestion = mongoose.model('newQuestion', questionSchema2);

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

app.get('/api/history', (req, res) => {
    newQuestion.find()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/api/data/:_id', (req, res) => {
    const _id = req.params._id;
    Question.findById(_id)
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ error: 'Data not found' });
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/api/questions', async (req, res) => {
    try {
        const data = new newQuestion({ 
            guildId: req.body.guildId, 
            userId: req.body.userId, 
            userName: req.body.userName,  
            question: req.body.question, 
            time: req.body.time,
            del_time: req.body.del_time 
        }); 

        const result = await data.save();
        res.status(201).json({ message: 'Question created successfully', question: result });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
