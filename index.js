const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});


app.use(express.static("./styles"));
app.use(express.static("./images"));
/**tried to work with pdf files, by manually creating one so the user could download the ingredients,but researched and found out that it requires knowledge of a different libraray to handle that, which i didnt have time to get into */
app.use(express.static("./texts"));

//middleware checking if recipes are availible
const checkIfAvailible =  (req,res,next)=>{
    console.log("Recipes are availible!")
    next();
}

//used .page extension to change pages
app.engine("page", (filePath, data, callback) => {  // Change options to data
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);

        // Use data.content and data.src instead of options
        const rendered = content.toString()
            .replace("#content#", data.content || "")
            .replace("#src#", data.src || "")
            .replace("#alt#",data.alt);
        return callback(null, rendered);
    });
});

//set the views and view engine
app.set("views", "./pages");
app.set("view engine", "page");

//set the content, image_src and image_alt for all the routes
//below rendered the home page
app.get("/", (req, res) => {
    const data = {
        content: "Ready to cook up some <a href=\"recipe\">recipes?</a>",
        src: "fruits&veggies.jpg",
        alt:""
    };
    res.render("home", data);
    
});
//middleware
app.use(checkIfAvailible);

app.get("/recipe/:recipe", (req, res) => {
    
    //Here there can be a case where a recipe is loaded depending on the param
    //Only had time for waffles 
    //Assume that depending on the parameter, the ingredients and image would change if it exists,
    //otherwise default content and src,
    //this could be ideal for api's used to change the content and image dynamically instead,
    //of having to write down every food and ingredients manually
    const data = {}

    if(req.params.recipe == "waffles"){
        data.content=`
                <ul>
                    <li><strong>Eggs:</strong> This waffle recipe starts with two whole eggs, whisked until light and fluffy.</li>
                    <li><strong>Flour:</strong> All-purpose flour adds gluten, which gives the waffles structure. You can also use whole wheat flour.</li>
                    <li><strong>Milk:</strong> Whole milk lends richness and moisture. Plus, it helps create the ideal batter consistency.</li>
                    <li><strong>Oil:</strong> A neutral oil, such as vegetable oil, ensures the waffles are nice and moist.</li>
                    <li><strong>Sugar:</strong> A tablespoon of white sugar adds the perfect amount of sweetness.</li>
                    <li><strong>Baking powder:</strong> Baking powder acts as a leavener, which means it contributes to the waffles' light and fluffy texture.</li>
                    <li><strong>Salt:</strong> A pinch of salt enhances the other flavors. Don't skip this step!</li>
                    <li><strong>Vanilla:</strong> A dash of vanilla adds complexity and enhances the overall flavor.</li>
                    <li><strong>Cooking spray:</strong> You'll need to spray the iron with nonstick cooking spray before you start making the waffles.</li>
                </ul>
                <a href = "/download/waffles">Download picture</a>

            `
            //above a tag triggers the path so the image can be downloaded
            data.src = "waff.jpg"
            data.alt = "waffles"
            

    }else{
        data.content = "ingredients arent availible for this item, it is IN the works"
        data.src
    }
    
    res.render("list", data);
});

// A list of recipes below
app.get("/recipe", (req, res) => {
    const data = {
        content: `
            <ul>
                <li><a href="recipe/waffles">Waffle Recipe</a></li>
                <li><a href="">Pancake Recipe</a></li>
                <li><a href="">French Toast Recipe</a></li>
            </ul>
        `,
        src: "",
        alt:""
    };
    res.render("list", data);
});


//Below nothing is rendered in return and image is downloaded

app.get("/download/waffles",(req,res)=>{
    const file = "./images/waff.jpg";
    res.download(file,"waffle.jpg",(err)=>{
        if(err){
            console.log("file not found");
        }
    })
})


