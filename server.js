const express=require("express");
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

const DATABASE="benutzerverwaltung.db";
const sqlite3= require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

app.use(express.static(__dirname + "/public")); 

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


app.post("/registration", function(req,res){
    const benutzername= req.body.name;
    const password= req.body.password;
    const repassword= req.body.repassword;
    let errorMessage="";
    //benutzerExistiert
    //db.get("select * from benutzerverwaltung where benutzername = ?", [benutzername],
    //    errorMessage="Der Benutzername existiert bereits. Bitte wählen Sie einen anderen Benutzernamen";    -> Wusste nicht wie ich die function "benutzerExistiert" implementieren kann.
    //    res.render("registerError",{"errorMessage":errorMessage});
    //);
    if(password!=repassword){
        errorMessage="Sie haben das Passwort falsch wiederholt";
        res.render("registerError",{"errorMessage":errorMessage});
    }
    else if(passwordValidation(password)!=true){
        errorMessage="Das Passwort stimmt nicht mit den Validierungsanforderungen überein";
        res.render("registerError",{"errorMessage":errorMessage});
    }
    else{
        db.run(
            `insert into benutzerverwaltung(benutzername, passwort) values (?, ?)`,
            [benutzername, password],
            function (err) {
                console.log(err);
                res.redirect("/registration");
            }
        );
        res.render("overview", {"benutzername":benutzername, "password":password});
    }
}); 

app.post("/auswertung", function(req,res){
    const benutzername= req.body.benutzername;
    const password= req.body.password;
    let errorMessage="";
    db.get(
        "select * from benutzerverwaltung where benutzername = ?",
        [benutzername],
        function (err, row) {
            if (row) {
                if (row.passwort == password) {
                    res.render("overview", {benutzername: benutzername, password: password,});
                } else {
                    errorMessage="Sie haben ein falsches Passwort eingegeben.";
                    res.render("loginError", {"errorMessage": errorMessage,
                    });
                }
            } 
            else {
                errorMessage="Kein Benutzer mit diesem Namen gefunden. Bitte versuchen Sie es nochmals.";
                res.render("loginError", { "errorMessage": errorMessage });
            }

        }
    );
        
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

function hallo(benutzername){
    db.get(
    "select * from benutzerverwaltung where benutzername = ?",
    [benutzername],
    function (err, row) {
        return true;
        });

}

