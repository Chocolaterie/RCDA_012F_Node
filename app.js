const express = require("express");
const uuid = require("uuid");

// instancier le server
const app = express();

// Autoriser a envoyer dans le request body le json
app.use(express.json());

// ------------------------------------------------
// * MongoDB
// ------------------------------------------------
const mongoose = require("mongoose");

// SUCCESS : On va ecouter quand il est connecté (on va afficher un message quand connecté)
mongoose.connection.once("open", () => {
  console.log("Vous êtes connecté(e) à la base");
});

// ERROR : Quand la connection ne marche pas
mongoose.connection.on("error", () => {
  console.log("Erreur de connexion à la base");
});

// Lancer la connexion à la bdd mongo
mongoose.connect("mongodb://127.0.0.1:27017/db_article");

// Modèle Article
const Article = mongoose.model(
  "Article",
  { uid: String, title: String, content: String, author: String },
  "articles"
);

// ------------------------------------------------
// * ROUTES
// ------------------------------------------------
app.get("/articles", async (request, response) => {
  // Récupérer les articles en base
  const articles = await Article.find();

  return response.json(articles);
});

app.get("/article/:uid", async (request, response) => {
  // récupérer un param d'url
  const uidParam = request.params.uid;

  // Essayer de trouver un article avec l'uid X
  const foundArticle = await Article.findOne({ uid: uidParam });

  return response.json(foundArticle);
});

app.post("/save-article", async (request, response) => {
  // Essaye de récupérer un article existant (à l'aide des données envoyées)
  const articleJSON = request.body;

  // Si l'article existe => Le code pour faire un update/mise à jour
  if (articleJSON.uid) {
    // Trouve un article dans la liste (c'est récupérer l'adresse de l'objet)
    const foundArticle = await Article.findOne({ uid: articleJSON.uid });

    if (foundArticle) {
      foundArticle.title = articleJSON.title;
      foundArticle.content = articleJSON.content;
      foundArticle.author = articleJSON.author;

      // Persister/Save en base
      await foundArticle.save();

      return response.json("Article modifié avec succès");
    }
  }
  // 2 :: CREATION
  // Sinon faire le code pour creer/ajouter un article
  const article = new Article(articleJSON); // pas encore base (crée en mémoire)

  // generer l'uid
  article.uid = uuid.v4();

  // persister/save en base
  await article.save();

  return response.json("Article crée avec succès");
});

app.delete("/delete-article/:uid", async (request, response) => {
  // récupérer un param d'url
  const uidParam = request.params.uid;

  // Récupérer l'article
  const article = await Article.findOne({ uid: uidParam });

  // Je supprime que si il existe
  if (article) {
    await article.deleteOne();
  }

  return response.json(`Article supprimé`);
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Le serveur est lancé");
});
