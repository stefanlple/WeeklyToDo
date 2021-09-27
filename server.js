//express
const express=require("express");
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//ejs
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

//sqlite 
const DATABASE="benutzerverwaltung.db";
const sqlite3= require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE);

//bcrypt
const bcrypt = require('bcrypt')

//session
const session= require('express-session');
app.use(session({
    secret: 'example',
    saveUninitialized: false,
    resave:false
}));

//paths
app.use(express.static(__dirname + "/public")); 

app.use(express.static(__dirname + "/views")); 

app.listen(3000,function(){
    console.log("listening on port 3000");
});


//Links
app.get("/begruessung", function(req,res){
    res.sendFile(__dirname +"/views/begruessung.html")
});

app.get("/login", function(req,res){
    res.render("loginError",{"errorMessage":""});
});

app.get("/register", function(req,res){
    res.render("registerError",{"errorMessage":""});
});

app.get("/logout", function(req,res){
    //Logout
    req.session.destroy();
    //redirect
    res.redirect("/login");
});

//Userlist (Test)
app.get("/benutzerliste", function (req, res) {
    db.all(`select * from benutzerverwaltung`, function (err, rows) {
        res.render("benutzerliste", { benutzerverwaltung: rows });
    });
});



//register
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
    else{
    db.all(`SELECT * FROM benutzerverwaltung WHERE benutzername= '${benutzername}'`,
     function(err,rows){
        if (rows.length == 0) {
            const hash= bcrypt.hashSync(password,10);
                db.run(
                    `insert into benutzerverwaltung(benutzername, passwort) values (?, ?)`,
                    [benutzername, hash],
                    function (err) {
                        req.session.user=benutzername;
                        res.redirect("/wochenansicht");
                    }
                );
        }
        else{
            errorMessage="The username already exists!"
            res.render("registerError",{"errorMessage":errorMessage});
        }     
    }); 
}
});
//login
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
                    req.session.user=benutzername;
                    res.redirect("/wochenansicht");
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
//todolist
app.get("/showday", function(req,res){
    if (req.session.user){
        const selectedDay=req.query.day;
        db.all(`select * from todos where benutzername = '${req.session.user}' and day='${selectedDay}'`,
        function(err,rows){
            res.render("Showday", {day:selectedDay, list: rows});
        });
    }
    else{
            res.redirect("/login");
        }
});

//weekly Todolist
app.get("/wochenansicht", function(req,res){
    if (req.session.user){
    db.all(`select * from todos where benutzername = '${req.session.user}'`,
    function(err,rows){
        res.render("Wochenansicht", {"benutzername":req.session.user, list: rows});
    }); 
}   
    else{
        res.redirect("/login");
}
});

//clear week
app.get("/clear", function(req,res){
    const user= req.session.user;
    db.run(`Delete from todos where benutzername='${user}'`,
        function(err){
            res.redirect("/wochenansicht")
        });
});
//add Todo
app.post("/addTodo", function(req,res){
    const user=req.session.user;
    const day= req.body.day;
    const newTodo= req.body.newTodo;
    db.run(`insert into todos (benutzername, day, todo, done) values ('${user}','${day}','${newTodo}',"false")`,
        function(err){
            res.redirect(`/showday?day=${day}`);
        });
});


//delete todo
app.post("/delete", function(req,res){
    const user= req.session.user;
    const id= req.body.id;
    const day= req.body.day;
    db.run(`Delete from todos where id=${id} and benutzername='${user}'`,
    function(err){
        res.redirect(`/showday?day=${day}`);
    }
    );
})
//done todo
app.post("/done", function(req,res){
    const id= req.body.id;
    const user= req.session.user;
    let done= req.body.done;
    const day= req.body.day;
    if(done=="false"){
        done="true";
    }
    else{
        done="false";
    }
    db.run(`update todos set done='${done}' where id=${id} and benutzername='${user}'`,
     function(err){
         res.redirect(`/showday?day=${day}`);

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
