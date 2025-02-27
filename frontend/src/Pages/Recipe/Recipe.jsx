import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './Recipe.css'

const Recipe = () => {
    const { id } = useParams(); //rappel des params de id
    const [recipe, setRecipe] = useState(null); // etat pour stocker la recette
    const [loading, setLoading] = useState(true); // gestion du chargement
    const [like, setLike] = useState(false);

    //-------------------------on crée favoriteRecipes pour stocker la recette liké dans le localStorage
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        //-------------some vérifie si au moins un favRecipe correspond a id 
        setLike(favorites.some(favRecipe => favRecipe._id === id));
    }, [id]);

    useEffect(() => {
        getRecipe()
    }, [id]);
    //-------------------------recuperation de la recette dans le backend
    const getRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:3003/recipes/${id}`);

            const data = await response.json();
            // console.log("Données récupérées:", data);
            setRecipe(data);
        } catch (error) {
            console.error("Erreur lors du chargement de la recette:", error);
        } finally {
            setLoading(false); //----------permet d'arreter le chargement en cas d'erreur
        }
    };

    //-------------------variable pour mettre en favoris
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        if (like) {
            //suppression des favoris si déjà liké
            const updatedFavorites = favorites.filter(favRecipe => favRecipe._id !== id);
            localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
            setLike(false);
        } else {
            //-----------------Ajout au favoris si recipe est chargé
            if (recipe) {
                const updatedFavorites = [...favorites, recipe];
                localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
                setLike(true);
            }
        }
    };

    if (loading) {
        return <p> Chargement de la recette -_-'...</p>
    }
    if (!recipe) {
        return <p> Recette non trouvée -_-'</p>;
    }


    return (
        <div className="recipePage">
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <div>
                <img src={`http://localhost:3003${recipe.image}`}
                    alt={recipe.title}
                />
                <div className="classH">

                    <img
                        className={`heart ${like ? 'favorite' : ''}`}
                        src='/public/like.svg'
                        alt='like'
                        onClick={toggleFavorite} />

                </div>
            </div>
            <p>Temps de préparation : {recipe.time} minutes</p>

            <h2>Ingrédients</h2>
            <ul>
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {typeof ingredient === 'string'
                            ? ingredient :
                            `${ingredient.quantity}
                            ${ingredient.unit} 
                            ${ingredient.name}`
                        }
                    </li>
                ))}
            </ul>

            <h2>Préparation</h2>
            <ol>
                {recipe.prep && recipe.prep.map((step, index) => (
                    <li key={index}>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Recipe;