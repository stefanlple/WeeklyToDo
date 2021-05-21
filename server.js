const express=require("express");
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//sqlite 
const DATABASE="benutzerverwaltung.db";
const sqlite3= require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

//bcrypt
const bcrypt = require('bcrypt')

//paths
app.use(express.static(__dirname + "/public")); 

app.use(express.static(__dirname + "/views")); 

app.listen(3000,function(){
    console.log("listening on port 3000");
});

app.get("/begruessung", function(req,res){
    res.sendFile(__dirname +"/views/begruessung.html")
});

app.get("/login", function(req,res){
    res.render("loginError",{"errorMessage":""});
});

app.get("/overview", function(req,res){
    res.sendFile(__dirname + "/views/overview.html")
});

app.get("/register", function(req,res){
    res.render("registerError",{"errorMessage":""});
});

app.get("/logout", function(req,res){
    res.redirect("/begruessung");
});

app.get("/benutzerliste", function (req, res) {
    db.all(`select * from benutzerverwaltung`, function (err, rows) {
        res.render("benutzerliste", { benutzerverwaltung: rows });
    });
});

//Tage Todolist
app.get("/wochenansicht", function(req,res){
    res.sendFile(__dirname + "/views/Days/Wochenansicht.html")
});

app.get("/monday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Monday.html")
});

app.get("/tuesday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Tuesday.html")
});

app.get("/wednesday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Wednesday.html")
});

app.get("/thursday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Thursday.html")
});

app.get("/friday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Friday.html")
});

app.get("/saturday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Saturday.html")
});

app.get("/sunday", function(req,res){
    res.sendFile(__dirname + "/views/Days/Sunday.html")
});


app.post("/registration", function(req,res){
    const benutzername= req.body.name;
    const password= req.body.password;
    const repassword= req.body.repassword;
    let errorMessage="";

    if(password!=repassword){
        errorMessage="The password was repeated incorrectly";
        res.render("registerError",{"errorMessage":errorMessage});
    }
    if(passwordValidation(password)!=true){
        errorMessage="The password does not match the validation requirements!";
        res.render("registerError",{"errorMessage":errorMessage});
    }

    db.all(`SELECT * FROM benutzerverwaltung WHERE benutzername= '${benutzername}'`,
     function(err,rows){
        if (rows.length == 0) {
            const hash= bcrypt.hashSync(password,10);
                db.run(
                    `insert into benutzerverwaltung(benutzername, passwort) values (?, ?)`,
                    [benutzername, hash],
                    function (err) {
                        res.render("overview", {"benutzername":benutzername, "password":password});
                    }
                );
        }
        else{
            errorMessage="The username already exists!"
            res.render("registerError",{"errorMessage":errorMessage});
        }     
    }); 
});

app.post("/auswertung", function(req,res){
    const benutzername= req.body.benutzername;
    const password= req.body.password;
    let errorMessage="";
    db.all(
        "select passwort from benutzerverwaltung where benutzername = ?",
        [benutzername],
        function (err, rows) {
            if (rows.length==1) {
                const hash= rows[0].passwort;
                const isValid= bcrypt.compareSync(password,hash);
                if(isValid==true){
                    //req.session.user=benutzername;
                    res.render("overview", {"benutzername":benutzername, "password":password});
                }
                else{
                    errorMessage="Wrong Password. Try again!";
                    res.render("loginError", { "errorMessage": errorMessage });
                }
            } 

            else {
                errorMessage="No user with this username exists. Try again!";
                    res.render("loginError", { "errorMessage": errorMessage });
            }
    });

}); 



function passwordValidation(password){
    if(password == "") {  
        return false;
    }    
    else if(password.length < 7) {  
        return false;
     }  
    else if(password.length > 16) {  
        return false;
    }  
    else if(password.search(/[a-z]/) < 0) {    
        return false;  
    } 
    else if(password.search(/[A-Z]/) < 0){
        return false;
    }
    else if(password.search(/[1-9]/) < 0){
        return false;
    }
    else {  
        return true;
    }  
}  


