"use strict";

let express = require('express');
let mustache = require('mustache-express');
let cookieSession = require('cookie-session');

let app = express();

let model = require('./model.js');

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    cookieSession({
        secret: "mot-de-passe-du-cookie",
    })
);

app.get('/', (req, res) => {
    if (req.session.user === undefined) {
        res.sendFile('authentificate.html', { 'root': './views' });
        model.deleteMatureContents();
    } else {
        res.render('index', { manga: model.mangaListIndex(), anime: model.animeListIndex(), username: req.session.user, userAvatar: model.userAvatar(req.session.user) });
    }
});

app.get('/inscription', (req, res) => {
    res.render('inscription.html', { check: "" });
});

app.post('/inscription', (req, res) => {
    if (model.user_check(req.body.username) === 0) {
        model.user_create(req.body.username, req.body.password);
        res.redirect('/connection');
    } else {
        res.render('inscription', { check: "Nom d'utilisateur indisponible" });
    }
});

app.get('/connection', (req, res) => {
    res.render('connection', { check: "" });
});

app.post('/connection', (req, res) => {
    if (model.user_connection(req.body.username, req.body.password) === 0) {
        req.session.user = req.body.username;
        res.redirect('/');
    } else {
        res.render('connection', { check: "Nom d'utilisateur ou mot de passe incorrect" });
    }
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

let middleware = (req, res, next) => {
    if (req.session.user === undefined) {
        res.sendFile('401.html', { 'root': './views' });
        return;
    } else {
        next();
        return;
    }
}

app.get('/mangas', middleware, (req, res) => {
    let manga_list = model.mangaList(req.session.user, req.query.page);
    manga_list['userAvatar'] =  ''+model.userAvatar(req.session.user);
    res.render('manga_list.html', manga_list);
});

app.get('/animes', middleware, (req, res) => {
    let anime_list = model.animeList(req.session.user, req.query.page);
    anime_list['userAvatar'] =  ''+model.userAvatar(req.session.user);
    res.render('anime_list.html', anime_list);
});

app.get("/manga/:title", middleware, (req, res) => {
    if (model.favMangaCheck(req.session.user, req.params.title) === 0) {
        res.render('manga_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), manga: model.readManga(req.params.title), value: "", value2: "Ajouter-favoris" });
    } else {
        res.render('manga_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), manga: model.readManga(req.params.title), value: "", value2: "Retirer-favoris" });
    }
});

app.post("/manga/:title", middleware, (req, res) => {
    if (model.favMangaCheck(req.session.user, req.params.title) === 0) {
        model.addMangaFav(req.session.user, req.params.title);
        res.render('manga_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), manga: model.readManga(req.params.title), value: "Manga ajouté avec succès", value2: "Retirer-favoris" });
    } else {
        model.deleteMangaFav(req.session.user, req.params.title);
        res.render('manga_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), manga: model.readManga(req.params.title), value: "Manga retiré avec succès", value2: "Ajouter-favoris" })
    }
});

app.get("/anime/:title", middleware, (req, res) => {
    if (model.favAnimeCheck(req.session.user, req.params.title) === 0) {
        res.render('anime_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), anime: model.readAnime(req.params.title), value: "", value2: "Ajouter-favoris" });
    } else {
        res.render('anime_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), anime: model.readAnime(req.params.title), value: "", value2: "Retirer-favoris" });
    }
});

app.post("/anime/:title", middleware, (req, res) => {
    if (model.favAnimeCheck(req.session.user, req.params.title) === 0) {
        model.addAnimeFav(req.session.user, req.params.title);
        res.render('anime_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), anime: model.readAnime(req.params.title), value: "Anime ajouté avec succès", value2: "Retirer-favoris" });
    } else {
        model.deleteAnimeFav(req.session.user, req.params.title);
        res.render('anime_details', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), anime: model.readAnime(req.params.title), value: "Anime retiré avec succès", value2: "Ajouter-favoris" })
    }
});

app.get("/search", middleware, (req, res) => {
    let found = model.search("%" + req.query.search + "%", req.query.page, req.session.user);
    found['userAvatar'] =  ''+model.userAvatar(req.session.user);
    res.render('search', found);
});

app.get("/user/:username", middleware, (req, res) => {
    res.render('user_page', { username: req.session.user, userAvatar: model.userAvatar(req.session.user), favManga: model.viewMangaFav(req.session.user), favAnime: model.viewAnimeFav(req.session.user) });
});

app.post("/user/:username/manga/:title", middleware, (req, res) => {
    model.deleteMangaFav(req.session.user, req.params.title);
    res.redirect("/user/" + req.session.user);
});

app.post("/user/:username/anime/:title", middleware, (req, res) => {
    model.deleteAnimeFav(req.session.user, req.params.title);
    res.redirect("/user/" + req.session.user);
});

app.post("/user/:username/mangaState/:title", middleware, (req, res) => {
    model.changeMangaState(req.session.user, req.params.title);
    res.redirect("/user/" + req.session.user);
});

app.post("/user/:username/animeState/:title", middleware, (req, res) => {
    model.changeAnimeState(req.session.user, req.params.title);
    res.redirect("/user/" + req.session.user);
});

app.get("/user/:username/:idAvatar", middleware, (req, res) => {
    model.setUserAvatar(req.session.user, req.params.idAvatar);
    res.redirect("/user/" + req.session.user);
});

app.listen(3000, () => console.log('Project server at http://localhost:3000'));