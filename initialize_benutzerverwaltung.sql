Create table benutzerverwaltung(
    id integer primary key autoincrement,
    benutzername text not null,
    passwort text not null,
    monday text,
    tuesday text ,
    wednesday text,
    thursday text,
    friday text,
    saturday text,
    sunday text
);


insert into benutzerverwaltung (benutzername, passwort) values ("Bob","Secret");