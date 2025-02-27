const Recipe = require('../models/Recipe');
const path = require('path');
const fs = require('fs');

//variable de création de recette
const addRecipe = async (req, res) => {
    try{
        console.log("Données reçues :", req.body); 
        console.log("Fichier reçu :", req.file);
        const {title, description, ingredients, prep, category, time} = req.body;

                //------------------- Débogage des données reçues
                console.log("Ingredients avant parsing:", ingredients);
                console.log("Prep avant parsing:", prep);

        //--------------------force le fait que le formulaire doit être complet
        if(!title || !description || !ingredients || !prep || !category || !time ) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires"})
        }
            //------------------on parse par besoin d'un tableau d'objet
        const parsedIngredients = JSON.parse(ingredients).map(ingredient => ({
            quantity: '',
            unit: '',
            name: ingredient
        }));
        const parsedPrep = JSON.parse(prep);

        console.log("Ingredients après parsing:", parsedIngredients);
        console.log("Prep après parsing:", parsedPrep);

            //---------------------------- Gestion de l'image
            let imageBase64 = null;
            if (req.file) {
                const imageBuffer = req.file.buffer
                imageBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            }console.log(imageBase64);
    
    //--------------on prepare la convertion en objet
    const newRecipe = new Recipe({
        title,
        description,
        ingredients: parsedIngredients,
        prep: parsedPrep,
        category,
        time,
        image: imageBase64
    }); 
    await newRecipe.save();
    res.status(201).json({message: "la recette est là", recipe:newRecipe});
        console.log("Données reçues :", req.body); 
        console.log("Fichier reçu :", req.file); // Pour vérifier l'image
}catch(err) {
    console.error('erreur dans la création:',err);
    res.status(500).json({ message: 'erreur interne dans la création'})
}};

//variable d'identification par Id
const getRecipeById = async (req, res) => {

    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

//--------------------variable pour afficher toute les recettes
const getAll = async (req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
}

//-----------------------------variable de la barre de recherche
const getSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if(!req.query.q){
            return res.status(400).json({ message: 'paramètre manquant'});
        }
        const searchQuery = query.toLowerCase();
        if (searchQuery.length < 2){
            return res.status(400).json({ message : 'trop court'});
        }
        //-----------------variable de recherche du nom ou des ingredients
        const recipes = await Recipe.find({
            $or:[
                { title: { $regex: searchQuery, $options: 'i' } },        //recherche dans les titres
                { ingredients: { $elemMatch:{ name: { $regex: searchQuery, $options: 'i' } }} }       //recherche dans les noms des ingredients
            ]
        })
        .sort({title:1})
        .limit(5);
        //-----donc on tri a partir de "title" dans l'ordre alphabétique et on se limite à 5 réponses

        //---------------verification si aucune recette trouvé
        if(recipes.length === 0) {
            return res.status(404).json({ message: 'Aucune recette trouvée'});
        }

        const suggestions = recipes.map(recipe => ({
            id: recipe._id,
            name: recipe.title
        }));
        res.json(suggestions);
    } catch (error) {
        console.error('erreur:', error);
        res.status(500).json({ message: 'Erreur de recherche',
            error: error.message,
            stack: error.stack
         });
    }

};
    

module.exports = {
    addRecipe,
    getAll,
    getRecipeById,
    getSearch
}