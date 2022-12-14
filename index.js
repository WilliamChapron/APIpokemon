// INIT LINK & MODULE

const express = require("express");
const app = express();
const port = 4444;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const jsonParser = bodyParser.json();

const dbo = require("./db/db");
const { ObjectId } = require("mongodb");
dbo.connectToServer();

var cors = require('cors');
app.use(cors());




// POKEMON CRUD


app.get("/pokemon/read", function (req, res) {
    const dbConnect = dbo.getDb();
    dbConnect.collection("pokemon").find({}).toArray(function (err, result) {
        res.json(result);
    });
});

app.post('/pokemon/insert', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    dbConnect.collection("type").findOne({_id:ObjectId(body.choice)}).then(function(returntype1,err){
        const type1 = returntype1;
        dbConnect.collection("type").findOne({_id:ObjectId(body.choice2)}).then(function(returntype2,err){
            const type2 = returntype2;
            dbConnect.collection("pokemon").insertOne({name:body.name,img:body.img,type:[{_id:type1._id,name:type1.name,img:type1.img},{_id:type2._id,name:type2.name,img:type2.img}],desctype1:body.desctype1,desctype2:body.desctype2});
        });
    });

});
app.post('/pokemon/update', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    filter = {_id: ObjectId(body.pokemonupdate)}
    dbConnect.collection("type").findOne({_id:ObjectId(body.choice)}).then(function(returntype1,err){
        const type1 = returntype1;
        dbConnect.collection("type").findOne({_id:ObjectId(body.choice2)}).then(function(returntype2,err){
            const type2 = returntype2;
            set = {$set:{name:body.name,img:body.img,type:[type1,type2],desctype1:body.desctype1,desctype2:body.desctype2}} 
            dbConnect.collection("pokemon").updateMany(filter,set);
            dbConnect.collection("pokedex").updateMany(filter,set);
            res.json(body);
        })
    })

});




app.delete('/pokemon/delete', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    filter = {_id:ObjectId(body.pokemondelete)}
    dbConnect.collection('pokemon').deleteMany(filter);
    dbConnect.collection('pokedex').deleteMany(filter);
});





// POKEDEX CRUD



app.get("/pokedex/read", function (req, res) {
    const dbConnect = dbo.getDb();
    dbConnect.collection("pokedex").find({}).toArray(function (err, result) {
        res.json(result);
    });
});


app.post('/pokedex/insert', jsonParser, (req, res) => {
    let body = req.body;
    const dbConnect = dbo.getDb();
    dbConnect.collection("pokemon").findOne({_id:ObjectId(body.choice)}).then(function(pokemon,err){
        dbConnect.collection("pokedex").findOne({_id:ObjectId(body.choice)}).then(function(pokemonPokedex,err){
            if (pokemonPokedex){
                res.json(pokemon);
            } else{
                dbConnect.collection("pokedex").insertOne({_id:pokemon._id,name:pokemon.name,type:pokemon.type});
                res.json(pokemon);
            }
        })
    })
});


app.delete('/pokedex/delete', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    filter = {_id:ObjectId(body.pokedexdelete)}
    dbConnect.collection('pokedex').deleteMany(filter);
});





// TYPE CRUD


app.get("/type/read", function (req, res) {
    const dbConnect = dbo.getDb();
    dbConnect.collection("type").find({}).toArray(function (err, result) {
        res.json(result);
    });
});


app.post('/type/insert', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    dbConnect.collection("type").insertOne({name:body.name,img:body.img});
});

app.post('/type/update', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb(); 
    filter = {_id: ObjectId(body.typeupdate)}; 
    set = {$set:{name:body.name}}
    dbConnect.collection("type").updateMany(filter,set);
    res.json(body)
});




app.delete('/type/delete', jsonParser, (req, res) => {
    const body = req.body;
    const dbConnect = dbo.getDb();
    filter = {name: body.typedelete}
    dbConnect.collection('type').deleteMany(filter);
    res.json(body);
});




// LISTEN

app.listen(port, function (){
    console.log(`App listening on port ${port}!`);
})