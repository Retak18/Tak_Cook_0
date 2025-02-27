const mongoose = require('mongoose');
const {Schema} = mongoose;

const RecipeSchema = new Schema({
    
    title:{
        type:String, 
        required:true},
    description:{
        type:String,
    required:true},
    ingredients: [
      {
        quantity: String,
        unit: String,
        name: String
      }
    ],
    prep: [ String ],
    image:{
      type: String,
      required:true},
      category:{
        type: String,
        required:true},
        time:{
            type:Number,
        }
});


module.exports= mongoose.model("Recipe", RecipeSchema);