require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

//environnement variable

const CONNECT_STRING = process.env.CONNECTION_STRING;
// console.log("🔍 CONNECTION_STRING:", process.env.CONNECTION_STRING);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

//-----------dossier pour les images
app.use('/public', express.static(path.join(__dirname, 'public/image')));
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));

const recipeRoutes = require('./routes/recipe')

mongoose.connect(CONNECT_STRING, { connectTimeoutMS: 2000 })
    .then(()=> {
        console.log('Tak Mongo is connected');
    }) .catch((error) =>{
        console.log(error)
    });

    //cors config includind the vercel front domain
app.use(cors({
    origin: [
        FRONTEND_URL,
        'https://cook.vercel.app'
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/recipes', recipeRoutes);

//for vercel, need a simple endpoint to check if API is alive
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

//determine port
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//for vercel serverless functions
module.exports = app