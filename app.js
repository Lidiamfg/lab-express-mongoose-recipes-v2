const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require('./models/Recipe.model')

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));


// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async (request, response) => {
    try {
        const newRecipe = await Recipe.create(request.body)
        response.status(201).json({recipe: newRecipe})
    } catch (error) {
        console.log(error)
        response.status(500).json({message: "Error while creating a new recipe"})
    }
})


//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (request, response) => {
    try {
        const recipes = await Recipe.find()
        response.status(200).json({recipes})
    } catch (error) {
        console.log(error)
        response.status(500).json({message: "Error while getting all recipes"})
    }
})

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (request, response) => {
    const {id} = request.params
    console.log(mongoose.isValidObjectId(id))
    if (mongoose.isValidObjectId(id)){
        try {
            const currentRecipe = await Recipe.findById(id)
            if (currentRecipe) {
                response.status(200).json({recipe: currentRecipe})
            } else {
                response.status(500).json({message: "Recipe not found"})
            }
        } catch (error) {
            console.log(error)
            response.status(400).json({error})
        }
    } else {
        response.status(500).json({message: "The id seems wrong"})
    }
})

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:id', async (request, response) => {
    const {id} = request.params
    try {
        const newRecipe = await Recipe.findByIdAndUpdate(id, request.body, {new:true})
        response.status(200).json({recipe: newRecipe})
    } catch (error) {
        console.log(error)
        response.status(400).json({error})
    }
})


//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:id', async (request, response) => {
    const {id} = request.params
    try {
        await Recipe.findByIdAndDelete(id)
        response.status(204).json({ message: 'Recipe deleted' })
    } catch (error) {
        console.log(error)
        response.status(500).json({error})
    }
    
})


// BONUS
//  Bonus: Iteration 9 - Create a Single User
//  POST  /users route


//  Bonus: Iteration 10 | Get a Single User
//  GET /users/:id route


//  Bonus: Iteration 11 | Update a Single User
//  GET /users/:id route


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;