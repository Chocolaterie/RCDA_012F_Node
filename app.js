const express = require('express');

// instancier le server
const app = express();

// ------------------------------------------------
// * ROUTES
// ------------------------------------------------
app.get('/articles', (request, response) => {
    response.json("Retournera la liste des articles");
});

app.get('/article/:id', (request, response) => {

    // récupérer un param d'url
    const id = request.params.id;

    // String template
    response.json(`Retournera un article ayant l'id ${id}`);
});

app.post('/save-article', (request, response) => {
    response.json("Va créer ou mettre à jour un article envoyé");
});

app.delete('/delete-article/:id', (request, response) => {

    // récupérer un param d'url
    const id = request.params.id;

    response.json(`Supprimera un article par l'id ${id}`);
});


// Lancer le serveur
app.listen(3000, () => {
    console.log('Le serveur est lancé');
});