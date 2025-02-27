import { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    //----------------------------gestion du formulaire pour le back
    const [formData, setFormData] = useState({

        title: "",
        description: "",
        ingredients: "",
        prep: "",
        category: "dish",
        time: "10",
        image: null,
    })


    useEffect(() => {

        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        getRecipes();
        getCategories();
    }, []);


    //mise a jour en direct de mon formulaire
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();//on evite le rafraichissement de la page
        setMessage(null); //on réinitialise tout les autres
        setError(null);
        setShowMessage(false);

        // Validation des champs avant l'envoi
        if (!formData.title || !formData.description || !formData.ingredients || !formData.prep) {
            setError("Tous les champs sont obligatoires (sauf l'image) !");
            setShowMessage(true);
            return;
        }
        //-------------------------------mise en forme pour envoi au backend
        const formDataSended = new FormData();

        formDataSended.append('title', formData.title);
        formDataSended.append('description', formData.description);
        formDataSended.append('ingredients', JSON.stringify(formData.ingredients.split('\n')));
        formDataSended.append('prep', JSON.stringify(formData.prep.split('\n')));
        formDataSended.append('category', formData.category);
        formDataSended.append('time', formData.time);
        if (formData.image) {
            formDataSended.append('image', formData.image);
        }
        try {
            const response = await fetch('http://localhost:3003/recipes', {
                method: "POST",
                body: formDataSended,
            });

            if (response.ok) {

                setMessage("Recette ajoutée avec succès !");
                setFormData({
                    title: "",
                    description: "",
                    ingredients: "",
                    prep: "",
                    category: "dish",
                    time: "",
                    image: null,
                });
                console.log(formData);
                getRecipes();  //-------------------Rechargement des recettes
            } else {
                // const errorData = await response.json();
                setError("Erreur lors de l'ajout, ou champs manquant");
                setShowMessage(true);
            }
        } catch (error) {
            console.error("erreur lors de l'envoi:", error);
            setError("Erreur lors de l'envoi");
            setShowMessage(true);
        }
    };
    //-----------------variable pour afficher toutes les recettes-----
    const getRecipes = async () => {
        try {
            const response = await fetch('http://localhost:3003/recipes');
            const data = await response.json();
            console.log('Donnée récuperées:', data);
            setRecipes(data);
        } catch (error) {
            console.error('Erreur lors du fetch recipe', error)
        }
    };
    // -------------ici on répète la variable d'appel car par défault on veut toutes les recettes
    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:3003/recipes');
            const data = await response.json();
            setSelectedCategory('Tous', data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='Home'>
            {/* ici on double conditionne les boutons donc active ou non active 
            avec un non actif au départ */}
            <div className="category-filter">
                <button
                    onClick={() => setSelectedCategory('Tous')}
                    className={selectedCategory === 'Tous' ? 'active' : ''}
                >
                    Tous
                </button>
                <button
                    onClick={() => setSelectedCategory('dish')}
                    className={selectedCategory === 'dish' ? 'active' : ''}
                >
                    Plats
                </button>
                <button
                    onClick={() => setSelectedCategory('dessert')}
                    className={selectedCategory === 'dessert' ? 'active' : ''}
                >
                    Desserts
                </button>
            </div>
            <div className="recipe_grid">
                {recipes
                    .filter(recipe =>
                        selectedCategory === 'Tous' || recipe.category === selectedCategory
                    )
                    .map((recipe) => (
                        <div key={recipe._id} className='recipe'>
                            <Link to={`/recipe/${recipe._id}`}>
                                <h3>{recipe.title}</h3>
                                <img className='various'src={recipe.image} alt={recipe.title} />
                                
                                   
                               
                                <p>Temps de préparation: {recipe.time} min</p>
                            </Link>
                        </div>
                    ))
                }
            </div>
            <form
                action="#"
                method="post"
                onSubmit={handleSubmit}>

                <label htmlFor="title">
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange} />
                <label htmlFor="description">
                    Description
                </label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange} />
                <label htmlFor="ingredients">
                    Ingredients
                </label>
                <textarea
                    name="ingredients"
                    id="ingredients"
                    cols="30"
                    rows="10"
                    autoCapitalize='sentences'
                    placeholder='Listez vos ingrédients, un par ligne.'
                    value={formData.ingredients}
                    onChange={handleInputChange}>
                </textarea>
                <label htmlFor="prep">
                    Preparation stage
                </label>
                <textarea
                    name="prep"
                    id="prep"
                    cols="30"
                    rows="10"
                    autoCapitalize='sentences'
                    placeholder=' Ecrivez vos étapes de préparation ici, le saut de ligne représente une étape séparé'
                    value={formData.prep}
                    onChange={handleInputChange}>
                </textarea>
                <div className='special'>
                    <div className='addImage'>
                        <label className='Image' htmlFor="myfile">
                            Image
                        </label>
                        <input
                            type="file"
                            id="myfile"
                            name="image"
                            onChange={handleInputChange} />
                    </div>
                    <div className='addCategory'>
                        <label htmlFor="category">
                            Category
                        </label>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleInputChange}>

                            <option value="dish">plat</option>
                            <option value="dessert">dessert</option>
                        </select>

                    </div>
                    <div className='addTime'>
                        <label htmlFor="time">
                            Temps
                        </label>
                        <select
                            name="time"
                            id="time"
                            value={formData.time}
                            onChange={handleInputChange}>

                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div> { /* affichage des message de validation ou d'erreur client */}
                {showMessage && message && <div className="validation-message">{message}</div>}
                {showMessage && error && <div className='error-message'>{error}</div>}
                <input type="submit" value="Envoyer" className="submit" />

            </form>
        </div>
    );
};

export default Home;