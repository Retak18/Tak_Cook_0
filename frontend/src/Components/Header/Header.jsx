import { useNavigate, Link } from 'react-router-dom';
import './Header.scss';
import { useState } from 'react';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate()


    const handleSearchChange = async (e) => {
       
        const query = e.target.value;
        setSearchQuery(query);

        //Requête pour récuperer les suggestions si la requête a plus de 2 lettres

        if (query.length > 1) {
            try {
                const response = await fetch(`http://localhost:3003/recipes/search?q=${query}`)
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setSuggestions(data);    // On stocke les suggestions dans l'état
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Error during the fetch', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    }
    //variable pour rendre les suggestions cliquable
    const handleSuggestionOnClick = (id) => {
        navigate(`/recipe/${id}`);  //Envoi à la page de la recette
        setSearchQuery(''); //reinitialise la barre de recherche
        setSuggestions([]); //réinitialise les suggestions
    }

    const navFav = () => {
        navigate('/favorite');
    };
    return (
        <header className='header'>
            <Link to="/">
                <h1>
                    <img src='/mdi_cook.svg' alt='Logo hat cooker' className='hat' />
                    " TAK COOK "
                    <img src='/mdi_cook.svg' alt='Logo hat cooker' className='hat' />
                </h1>
            </Link>
            <form>
                <label htmlFor="search"></label>
                <input
                    type='search'
                    id='search'
                    name='search'
                    placeholder=' Recherche...'
                    value={searchQuery}
                    onChange={handleSearchChange} />
                    <div className='suggestionCase'>
                        {/* condition pour afficher des suggestions si il y a au moins une de possible */}
                {suggestions.length > 0 && (<ul className='suggestion'>
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => {handleSuggestionOnClick(suggestion.id)}}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSuggestionOnClick(suggestion.id);
                            }}
                            role='button'
                            tabIndex='0'>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>)}
                </div>
            </form>
            <div className='button'>
                <button onClick={navFav}> Favorite </button>
            </div>
        </header>
    );
};

export default Header;