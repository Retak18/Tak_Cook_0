import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import './App.css'
import Home from './Pages/Home/Home';
import Recipe from './Pages/Recipe/Recipe';
import Favorite from './Pages/Favorite/Favorite';



function App() {
 

  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/recipe/:id' element={<Recipe/>}/>
    <Route path='/favorite' element={<Favorite/>} />
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
