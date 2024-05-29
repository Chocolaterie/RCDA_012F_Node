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

function performResponseService(response, code, message, data) {
  console.log(`Code: ${code} | Message : ${message}`);
  return response.json({ code: code, message: message, data: data });
}


// ------------------------------------------------
// * ROUTES
// ------------------------------------------------
app.get("/articles", async (request, response) => {
  // Récupérer les articles en base
  const articles = await Article.find();

  return performResponseService(response, "200", "La liste des articles a été récupérés avec succès", articles);
});

app.get("/article/:uid", async (request, response) => {
  // récupérer un param d'url
  const uidParam = request.params.uid;

  // Essayer de trouver un article avec l'uid X
  const foundArticle = await Article.findOne({ uid: uidParam });

  // RG-002 : 702 
  if (!foundArticle) {
    return performResponseService(response, "702", `Impossible de récupérer un article avec l'UID ${uidParam}`, null);
  }

  // RG-002 : 200
  return performResponseService(response, "200", `Article récupéré avec succès`, foundArticle);
});

app.post("/save-article", async (request, response) => {
  // Essaye de récupérer un article existant (à l'aide des données envoyées)
  const articleJSON = request.body;

  // Si l'article existe => Le code pour faire un update/mise à jour
  if (articleJSON.uid) {

    // Trouve un article dans la liste (c'est récupérer l'adresse de l'objet)
    const foundArticle = await Article.findOne({ uid: articleJSON.uid });

    if (foundArticle) {
      // RG-004 | 701
      // Trouver un article (sauf l'article à modifier) ayant le même titre que le titre envoyé en JSON
      const foundArticleByTitle = await Article.findOne({ uid: { $ne : foundArticle.uid }, title: articleJSON.title });
      if (foundArticleByTitle){
        return performResponseService(response, "701", `Impossible de modifier un article dont un autre article possède un titre similaire`, foundArticle);
      }

      // updateOne($set: articleJSON)
      foundArticle.title = articleJSON.title;
      foundArticle.content = articleJSON.content;
      foundArticle.author = articleJSON.author;

      // Persister/Save en base
      await foundArticle.save();

      // RG-004 | 200
      return performResponseService(response, "200", `Article modifié avec succès`, foundArticle);
    }
  }
  // 2 :: CREATION
  // Sinon faire le code pour creer/ajouter un article
  const article = new Article(articleJSON); // pas encore base (crée en mémoire)

  // RG-003 | 701
  // Verifier qu'un article ayant le même titre que le titre envoyé en json
  const foundArticleByTitle = await Article.findOne({ title: articleJSON.title });
  if (foundArticleByTitle) {
    return performResponseService(response, "701", `Impossible d'ajouter un article avec un titre déjà existant`, null);
  }

  // generer l'uid
  article.uid = uuid.v4();

  // persister/save en base
  await article.save();

  // RG-003 | 200
  return performResponseService(response, "200", `Article ajouté avec succès`, article);
});

app.delete("/delete-article/:uid", async (request, response) => {
  // récupérer un param d'url
  const uidParam = request.params.uid;

  // Récupérer l'article
  const article = await Article.findOne({ uid: uidParam });

  // RG-005 | 702
  if (!article){
    return performResponseService(response, "702", `Impossible de supprimer un article dont l'UID n'existe pas`, null);
  }

  await article.deleteOne();

  // RG-005 | 200
  return performResponseService(response, "200", `L'article ${uidParam} a été supprimé avec succès`, article);
});

// Lancer le serveur
app.listen(3000, () => {
  console.log("Le serveur est lancé");
});
