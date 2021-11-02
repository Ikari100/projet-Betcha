///Connexion

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/JeuBetcha",
{ useNewUrlParser: true })
.then(() => console.log("Connected to Mongo…"))
.catch((error) => console.log(error.message))

///Schèma

const betchaSchema = mongoose.Schema({
    login_name: String,
    password_user : String
});

const gameSchema = mongoose.Schema({
    game_name: String,
    login_name : String,
    cb_etat : String
});

const miseSchema = mongoose.Schema({
    mise: Number
})

///Model

const Betcha = mongoose.model("Betcha", betchaSchema);

 const Game = mongoose.model("Game", gameSchema);

 const Mise = mongoose.model("Mise", miseSchema);
/// Express

const express = require('express');
const { receiveMessageOnPort } = require('worker_threads');
 
const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

let users = []

app.get("/",(req,res)=>{
    res.redirect("Accueil.html")
})

app.get("hello",(req,res)=>{
    res.send("hello world!")
})

app.post("/Accueil",(req,res)=>{
    console.log(req.body);
    let newPerson = new Betcha({
        login_name: req.body.login_name,
        password_user: req.body.password_user  
    });
    
    newPerson.save(function (err, Person) {
        if (err)
            console.log(err);
        else
            console.log('Success');
    });
    res.redirect("/Connexion.html")
})

app.post("/Accueil",(req,res)=>{

})


app.post("/Creation_Partie",(req,res)=>{
    console.log(req.body);
    let newGame = new Game({
        game_name: req.body.game_name,
        login_name: req.body.login_name ,
        cb_etat: req.body.cb_etat
    });
    
    newGame.save(function (err, Game) {
        if (err)
            console.log(err);
        else
            console.log('Success',Game);
            res.redirect("/Connexion.ejs")
    });
     
})

app.get("/Connexion",function(req,res){
res.render("Connexion.ejs")
})

app.post("/Connexion",async (req,res)=>{
    console.log(req.body);
    let newPerson = new Betcha({
        login_name: req.body.login_name,
        password_user: req.body.password_user  
    });
    const user = await  Betcha.findOne({login_name:req.body.login_name},{"login_name":1,"password_user":1,"_id":0})
        if(user != null && user.password_user == req.body.password_user)
    
            res.redirect("/game.html");
        else
        res.redirect("/Connexion.html")
            console.log("Nom d'utilisateur ou mot de passe incorrect")
})

app.get("/users",(req,res)=>{
    
    res.json(users)
})

app.listen(3000, () =>{
    console.log("Server started on port...")
});