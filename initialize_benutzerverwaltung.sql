Create table benutzerverwaltung(
    id integer primary key autoincrement,
    benutzername text not null,
    passwort text not null
);

Create table todos(
    id integer primary key autoincrement,
    benutzername text not null,
    day text not null,
    todo text not null,
    done text not null
);
insert into benutzerverwaltung (benutzername, passwort) values ("Bob","Secret");