Create table benutzerverwaltung(
    id integer primary key autoincrement,
    benutzername text not null,
    passwort text not null
);

insert into benutzerverwaltung (benutzername, passwort) values ("Alice","§$Y45/912v");
insert into benutzerverwaltung (benutzername, passwort) values ("Bob","Secret");
insert into benutzerverwaltung (benutzername, passwort) values ("Carla","123");
