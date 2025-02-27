const express = require('express');
const multer = require('multer');
const path = require('path');

const { getAll, addRecipe, getRecipeById, getSearch } = require('../controllers/recipeController');
const router = express.Router();
 // ------------------permet l'enregistrement correct des images
// const storage = multer.diskStorage({
//     destination:(req, file, cb) => {
//         cb(null, path.join( __dirname, '../public/image'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.originalname}` )
//     }
// });
const upload = multer({ 
    storage: multer.memoryStorage()
});

router.get('/search', getSearch);
router.get('/', getAll);
router.post('/', upload.single('image'), addRecipe);
router.get('/:id', getRecipeById);

module.exports = router;