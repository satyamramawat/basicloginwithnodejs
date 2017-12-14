var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/nfriendship');

var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    address: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({loginun:username, loginpass:password}, function(err,user){
        if(err){
            console.log(err);
            return res.status(500).send("error");
        }

        if(!user)
        {
            return res.status(404).send("User not found");
        }
        
        return res.send("Logged in Successfully");
    });

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

