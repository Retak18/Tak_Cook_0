require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

//environnement variable

const CONNECT_STRING = process.env.CONNECTION_STRING;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

//-----------dossier pour les images
app.use('/public', express.static(path.join(__dirname, 'public/image')));
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));

const recipeRoutes = require('./routes/recipe')

console.log("Tentative de connexion à MongoDB avec:", 
    CONNECT_STRING?.substring(0, 20) + "...[restant masqué]");
// Vérifiez si la chaîne commence bien par le bon préfixe
console.log("Starts with mongodb+srv://:", CONNECT_STRING.startsWith("mongodb+srv://"));

// Affichez les premiers caractères pour voir s'il y a des caractères invisibles
console.log("First 20 characters:", [...CONNECT_STRING].slice(0, 20));
mongoose.connect(CONNECT_STRING, { connectTimeoutMS: 2000 })
    .then(()=> {
        console.log('Tak Mongo is connected');
    }) .catch((error) =>{
        console.error(error)
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