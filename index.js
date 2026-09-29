import express from "express";


import axios from "axios";

const app = express();

const port = 6767;

app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));


// main page
app.get("/", (req, res) => 
    {
    res.render("index.ejs", 
        
        {
        drink: null,
        ingredients: [],
        error: null
    });
});


// runs after the user submits the form
app.post("/drink", async (req, res) =>
    
    {

    const drinkType = req.body.drinkType;

    try {

        // get drinks that match the type the user picked
        const response = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
            {
                params: {
                    a: drinkType
                }
            }
        );

        const drinks = response.data.drinks;

        if (!drinks || drinks.length === 0) 
            {
            return res.render("index.ejs", 
                
                
            {
                drink: null,
                ingredients: [],
                error: "No drinks were found. Try again."
            });
        }

        // choose a random drink from the results
        const randomNumber = Math.floor(Math.random() * drinks.length);


        const randomDrink = drinks[randomNumber];


        // the first request only gives basic information,
        // so this gets the full recipe using the drink id
        const detailsResponse = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/lookup.php",
            {
                params: 
                
                {
                    i: randomDrink.idDrink
                }
            }
        );

        const drink = detailsResponse.data.drinks[0];

        // CocktailDB stores ingredients in ingredient1, ingredient2, etc.
        // this puts them into one array so they are easier to display
        const ingredients = [];

        for (let i = 1; i <= 15; i++) 


            {

            const ingredient = drink[`strIngredient${i}`];
            const measurement = drink[`strMeasure${i}`];

            if (ingredient) 
                {
                ingredients.push({
                    ingredient: ingredient,
                    measurement: measurement || ""
                });
            }
        }


        res.render("index.ejs", 
            
            
        {
            drink: drink,
            ingredients: ingredients,
            error: null
        });

    } catch (error)
    
    {

        console.log(error.message);

        res.render("index.ejs", 
            
        {
            drink: null,
            ingredients: [],
            error: " There was a problem getting a drink. please try again."
        });
    }
});


app.listen(port, () => 
    
    
{
    console.log(`Server running on port ${port}`);
});