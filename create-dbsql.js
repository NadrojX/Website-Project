"use strict";

let Sqlite = require("better-sqlite3");

let db = new Sqlite("db.sqlite");

// db.prepare("DROP TABLE favAnime").run();
// db.prepare("DROP TABLE favManga").run();
// db.prepare("DROP TABLE users").run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "username TEXT, " +
  "password TEXT," +
  "avatar INT)").run();

//creation database animes
db.prepare(
  "CREATE TABLE IF NOT EXISTS animes (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "title TEXT UNIQUE," +
  "title_english TEXT UNIQUE," +
  "episodes INTEGER," +
  "status TEXT," +
  "duration TEXT," +
  "score TEXT," +
  "year INTEGER," +
  "studios TEXT," +
  "synopsis TEXT," +
  "image_url TEXT)").run();

//creation database manga
db.prepare(
  "CREATE TABLE IF NOT EXISTS mangas (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  "title TEXT UNIQUE," +
  "title_english TEXT UNIQUE," +
  "chapters INTEGER," +
  "status TEXT," +
  "volumes TEXT," +
  "score FLOAT," +
  "year INTEGER," +
  "synopsis TEXT," +
  "image_url TEXT," +
  "genres TEXT," +
  "serializations TEXT," +
  "authors TEXT)").run();

//creation database favoris Manga
db.prepare(
  "CREATE TABLE IF NOT EXISTS favManga (username TEXT," +
  "title TEXT," +
  "state TEXT)").run();

//creation database favoris Anime
db.prepare(
  "CREATE TABLE IF NOT EXISTS favAnime (username TEXT," +
  "title TEXT," +
  "state TEXT)").run();

const fetch = require('node-fetch');

const url = 'https://api.jikan.moe/v4/random/anime';
const url2 = 'https://api.jikan.moe/v4/random/manga';

/* //anime construction database
for (let i = 1; i < 4000; i++) {
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (json) {
    let title = json["data"]["title"];
    let title_english = json["data"]["title_english"];
    let episodes = json["data"]["episodes"];
    let status = json["data"]["status"];
    let duration = json["data"]["duration"];
    let score = json["data"]["score"];
    let year = json["data"]["year"];
    let studios = json["data"]["studios"][0]["name"];
    let synopsis = json["data"]["synopsis"];
    let image_url = json["data"]["images"]["jpg"]["image_url"];
    db.prepare("INSERT INTO animes (title, title_english, episodes, status, duration, score, year, studios, synopsis, image_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(title, title_english, episodes, status, duration, score, year, studios, synopsis, image_url);
  }).catch(err => console.error('e:' + err));
}

//manga construction database
for (let i = 1; i < 4000; i++) {
  fetch(url2).then(function (response) {
    return response.json();
  }).then(function (json) {
    let title = json["data"]["title"];
    let title_english = json["data"]["title_english"];
    let chapters = json["data"]["chapters"];
    let status = json["data"]["status"];
    let volumes = json["data"]["volumes"];
    let score = json["data"]["score"];
    let year = json["data"]["year"];
    let synopsis = json["data"]["synopsis"];
    let image_url = json["data"]["images"]["jpg"]["image_url"];
    let genres = json["data"]["genres"][0]["name"];
    let serializations = json["data"]["serializations"][0]["name"];
    let authors = json["data"]["authors"][0]["name"];
    db.prepare("INSERT INTO mangas (title, title_english, chapters, status, volumes, score, year, synopsis, image_url, genres, serializations, authors) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(title, title_english, chapters, status, volumes, score, year, synopsis, image_url, genres, serializations, authors);
  }).catch(err => console.error('e:' + err));
} */