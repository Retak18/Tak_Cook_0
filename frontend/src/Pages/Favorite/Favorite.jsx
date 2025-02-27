import { useEffect, useState } from 'react';
import './Favorite.css';
import { Link } from 'react-router-dom';

const Favorite = () => {
    const [like, setLike] = useState([]);

    useEffect(() => {
        //import du localStorage
        const storageFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        setLike(storageFavorites);
    }, []);

    //-------------fonction de suppression du mis en favoris
    const removeLikes = (recipeId) => {
        const updatedFavorites = like.filter(recipe => recipe._id !== recipeId);
        setLike(updatedFavorites);
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    };

    return (
        <div className='favoritePage'>
            <h1> Mes recettes favorites </h1>
            {like.length === 0 ? (
                <p> Vous n'avez pas encore ajouter de recettes favorites</p>
            ) : (
                <div >
                    <div  className='favorite-grid'>
                    {like.map(recipe => (
                        //on identifie les recettes par _id
                        <div key={recipe._id} className='favorite-recipe'>
                            <Link to={`/recipe/${recipe._id}`}>
                                <h3>{recipe.title}</h3>
                                <img src={`http://localhost:3003${recipe.image}`} alt={recipe.title} className='imageR' />
                                <p>Temps de préparation: {recipe.time} min</p>
                            </Link>
                            {/* logique pour interagir avec le coeur en CSS */}
                            <img
                                className={`heart ${like ? 'favorite' : ''}`}
                                src='/public/like.svg'
                                alt='like'
                                onClick={() => removeLikes(recipe._id)} />
                                 
                        </div>
                    ))}
                </div>
                </div>
            )}
          
        </div>
    );
};

export default Favorite;