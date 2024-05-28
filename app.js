const express = require('express');

// instancier le server
const app = express();

// Autoriser a envoyer dans le request body le json
app.use(express.json());

// ------------------------------------------------
// * MOCK DATA
// ------------------------------------------------
// Simulation de données en mémoire
let DB_ARTICLES = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

// ------------------------------------------------
// * ROUTES
// ------------------------------------------------
app.get('/articles', (request, response) => {
    return response.json(DB_ARTICLES);
});

app.get('/article/:id', (request, response) => {

    // récupérer un param d'url
    const id = parseInt(request.params.id);

    // Essayer de trouver un article avec l'id X
    const foundArticle = DB_ARTICLES.find(article => article.id === id);

    return response.json(foundArticle);
});

app.post('/save-article', (request, response) => {
    // Essaye de récupérer un article existant (à l'aide des données envoyées)
    const articleJSON = request.body;

    // Si l'article existe => Le code pour faire un update/mise à jour
    if (articleJSON.id){

        // Trouve un article dans la liste (c'est récupérer l'adresse de l'objet)
        const foundArticle = DB_ARTICLES.find(article => article.id === articleJSON.id);

        if (foundArticle) {
            foundArticle.title = articleJSON.title;
            foundArticle.content = articleJSON.content;

            return response.json("Article modifié avec succès");
        }
    }
    // Sinon faire le code pour creer/ajouter un article
    DB_ARTICLES.push(articleJSON);

    return response.json("Article crée avec succès");
});

app.delete('/delete-article/:id', (request, response) => {
    // récupérer un param d'url
    const id = parseInt(request.params.id);

    // si existe on supprime
    const foundIndex = DB_ARTICLES.findIndex(article => article.id === id);

    // supprimer depuis l'index
    DB_ARTICLES.splice(foundIndex, 1);

    return response.json(`Article supprimé`);
});


// Lancer le serveur
app.listen(3000, () => {
    console.log('Le serveur est lancé');
});