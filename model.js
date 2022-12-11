"use strict";

let Sqlite = require("better-sqlite3");

let db = new Sqlite("db.sqlite");
let bcrypt = require('bcrypt');

let crypt_password = (password) => {
    let saved_hash = bcrypt.hashSync(password, 10);
    return saved_hash;
}

let compare_password = (password, saved_hash) => {
    return bcrypt.compareSync(password, saved_hash) == true;
}

exports.deleteMatureContents = () => {
    db.prepare("DELETE FROM mangas WHERE genres = ? OR genres = ? OR genres = ? OR genres = ?").run("Hentai", "Erotica", "Boys Love", "Girls Love");
}

exports.user_check = (username) => {
    if (db.prepare("SELECT username FROM users WHERE username = ?").get(username) === undefined) {
        return 0;
    } else {
        return 1;
    }
}

exports.user_create = (username, password) => {
    db.prepare("INSERT INTO users (username, password, avatar) VALUES (?,?,?)").run(username, crypt_password(password), 0);
}

exports.user_connection = (username, password) => {
    let saved_hash = db.prepare("SELECT password FROM users WHERE username = ?").get(username);
    if (db.prepare("SELECT username FROM users WHERE username = ?").get(username) !== undefined) {
        if (compare_password(password, saved_hash.password)) {
            return 0;
        } else {
            return 1;
        }
    }
}

exports.userAvatar = (username) =>{
    let avatar = db.prepare("SELECT avatar FROM users WHERE username = ?").get(username);
    if (avatar.avatar === 0) {
        return "Illustration14"
    }
    if (avatar.avatar === 1) {
        return "Illustration15"
    }
    if (avatar.avatar === 2) {
        return "Illustration17"
    }
}

exports.mangaList = (user, page) => {
    const num_per_page = 32;
    page = parseInt(page || 1)

    let num_found_Manga = db.prepare("SELECT COUNT (*) FROM mangas").get()["COUNT (*)"];
    let results = db.prepare("SELECT * FROM mangas ORDER BY score DESC LIMIT ? OFFSET ?").all(num_per_page, (page - 1) * num_per_page);

    return {
        results: results,
        num_found_Manga: num_found_Manga,
        previous_page: page - 1,
        next_page: page + 1,
        page: page,
        num_pages_Manga: parseInt(num_found_Manga / num_per_page) + 1,
        username: user,
    };
}

exports.animeList = (user, page) => {
    const num_per_page = 32;
    page = parseInt(page || 1)

    let num_found_Anime = db.prepare("SELECT COUNT (*) FROM animes").get()["COUNT (*)"];
    let results = db.prepare("SELECT * FROM animes ORDER BY score DESC LIMIT ? OFFSET ?").all(num_per_page, (page - 1) * num_per_page);

    return {
        results: results,
        num_found_Anime: num_found_Anime,
        previous_page: page - 1,
        next_page: page + 1,
        page: page,
        num_pages_Anime: parseInt(num_found_Anime / num_per_page) + 1,
        username: user,
    };
}

exports.animeListIndex = () => {
    let animes = db.prepare("SELECT id, title, image_url FROM animes ORDER BY score DESC LIMIT 6").all();
    return animes;
}

exports.mangaListIndex = () => {
    let mangas = db.prepare("SELECT id, title, image_url FROM mangas ORDER BY score DESC LIMIT 6").all();
    return mangas;
}

exports.readManga = function (title) {
    let select = db
        .prepare("SELECT * FROM mangas WHERE ? IN (SELECT title FROM mangas) AND title = ?")
        .get(title, title);
    if (select.title === null) {
        select.title = "unknown";
    }
    if (select.title_english === null) {
        select.title_english = "unknown";
    }
    if (select.chapters === null) {
        select.chapters = "unknown";
    }
    if (select.status === null) {
        select.status = "unknown";
    }
    if (select.volumes === null) {
        select.volumes = "unknown";
    }
    if (select.score === null) {
        select.score = "unknown";
    }
    if (select.year === null) {
        select.year = "unknown";
    }
    if (select.synopsis === null) {
        select.synopsis = "unknown";
    }
    if (select.genres === null) {
        select.genres = "unknown";
    }
    if (select.serializations === null) {
        select.serializations = "unknown";
    }
    if (select.authors === null) {
        select.authors = "unknown";
    }
    if (select != undefined) {
        return select;
    }
    return null;

};

exports.readAnime = function (title) {
    let select = db
        .prepare("SELECT * FROM animes WHERE ? IN (SELECT title FROM animes) AND title = ?")
        .get(title, title);
    if (select.title === null) {
        select.title = "unknown";
    }
    if (select.title_english === null) {
        select.title_english = "unknown";
    }
    if (select.episodes === null) {
        select.episodes = "unknown";
    }
    if (select.status === null) {
        select.status = "unknown";
    }
    if (select.duration === null) {
        select.duration = "unknown";
    }
    if (select.score === null) {
        select.score = "unknown";
    }
    if (select.year === null) {
        select.year = "unknown";
    }
    if (select.synopsis === null) {
        select.synopsis = "unknown";
    }
    if (select.studios === null) {
        select.studios = "unknown";
    }
    if (select != undefined) {
        return select;
    }
    return null;
};

exports.favMangaCheck = (username, title) => {
    if (db.prepare("SELECT * FROM favManga WHERE username = ? AND title = ?").get(username, title) === undefined) {
        return 0;
    } else {
        return 1;
    }
}

exports.favAnimeCheck = (username, title) => {
    if (db.prepare("SELECT * FROM favAnime WHERE username = ? AND title = ?").get(username, title) === undefined) {
        return 0;
    } else {
        return 1;
    }
}

exports.addMangaFav = function (username, title) {
    db.prepare("INSERT INTO favManga (username, title, state) VALUES(?,?,?)").run(username, title, "pas-lu");
};

exports.deleteMangaFav = (username, title) => {
    db.prepare("DELETE FROM favManga WHERE username = ? AND title = ?").run(username, title);
}

exports.viewMangaFav = (username) => {
    let mangasFav = db.prepare("SELECT mangas.title, image_url, favManga.state FROM mangas INNER JOIN favManga ON mangas.title = favManga.title WHERE favManga.username = ?").all(username);
    return mangasFav;
}

exports.addAnimeFav = function (username, title) {
    db.prepare("INSERT INTO favAnime (username, title, state) VALUES(?,?,?)").run(username, title, "pas-vu");
};

exports.deleteAnimeFav = (username, title) => {
    db.prepare("DELETE FROM favAnime WHERE username = ? AND title = ?").run(username, title);
}

exports.viewAnimeFav = (username) => {
    let animesFav = db.prepare("SELECT animes.title, image_url, favAnime.state FROM animes INNER JOIN favAnime ON animes.title = favAnime.title WHERE favAnime.username = ?").all(username);
    return animesFav;
}

exports.search = (search, page, user) => {
    const num_per_page = 32;
    search = search || "";
    page = parseInt(page || 1)

    let num_found_Manga = db.prepare("SELECT COUNT (*) FROM mangas WHERE title OR title_english LIKE ?").get(search)["COUNT (*)"];
    let num_found_Anime = db.prepare("SELECT COUNT (*) FROM animes WHERE title OR title_english LIKE ?").get(search)["COUNT (*)"];

    let results = db.prepare("SELECT * FROM mangas WHERE title OR title_english LIKE ? ORDER BY score DESC LIMIT ? OFFSET ?").all(search, num_per_page, (page - 1) * num_per_page);
    let results2 = db.prepare("SELECT * FROM animes WHERE title OR title_english LIKE ? ORDER BY score DESC LIMIT ? OFFSET ?").all(search, num_per_page, (page - 1) * num_per_page);

    return {
        results: results,
        results2: results2,
        num_found_Manga: num_found_Manga,
        num_found_Anime: num_found_Anime,
        search: search,
        previous_page: page - 1,
        next_page: page + 1,
        page: page,
        num_pages_Manga: parseInt(num_found_Manga / num_per_page) + 1,
        num_pages_Anime: parseInt(num_found_Anime / num_per_page) + 1,
        username: user
    };
}

exports.changeMangaState = (username, title) => {
    let state = db.prepare("SELECT state FROM favManga WHERE username = ? AND title = ?").get(username, title);
    if (state.state === "pas-lu") {
        db.prepare("UPDATE favManga SET state = ? WHERE username = ? AND title = ?").run("à-lire", username, title);
    }
    if (state.state === "à-lire") {
        db.prepare("UPDATE favManga SET state = ? WHERE username = ? AND title = ?").run("en-cours", username, title);
    }
    if (state.state === "en-cours") {
        db.prepare("UPDATE favManga SET state = ? WHERE username = ? AND title = ?").run("lu", username, title);
    }
    if (state.state === "lu") {
        db.prepare("UPDATE favManga SET state = ? WHERE username = ? AND title = ?").run("pas-lu", username, title);
    }
}

exports.changeAnimeState = (username, title) => {
    let state = db.prepare("SELECT state FROM favAnime WHERE username = ? AND title = ?").get(username, title);
    if (state.state === "pas-vu") {
        db.prepare("UPDATE favAnime SET state = ? WHERE username = ? AND title = ?").run("à-voir", username, title);
    }
    if (state.state === "à-voir") {
        db.prepare("UPDATE favAnime SET state = ? WHERE username = ? AND title = ?").run("en-cours", username, title);
    }
    if (state.state === "en-cours") {
        db.prepare("UPDATE favAnime SET state = ? WHERE username = ? AND title = ?").run("vu", username, title);
    }
    if (state.state === "vu") {
        db.prepare("UPDATE favAnime SET state = ? WHERE username = ? AND title = ?").run("pas-vu", username, title);
    }
}

exports.setUserAvatar = (username, id) => {
    if (id === "0") {
        db.prepare("UPDATE users SET avatar = ? WHERE username = ? ").run(0, username); 
    }
    if (id === "1") {
        db.prepare("UPDATE users SET avatar = ? WHERE username = ? ").run(1, username);  
    }
    if (id === "2") {
        db.prepare("UPDATE users SET avatar = ? WHERE username = ? ").run(2, username);  
    }
}