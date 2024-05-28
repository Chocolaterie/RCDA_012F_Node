const express = require('express');
const appRoutes = require('./routes');

// instancier le server
const app = express();

// ------------------------------------------------
// * ROUTES
// ------------------------------------------------
appRoutes.declareRoutes(app);

// Lancer le serveur
app.listen(3000, () => {
    console.log('Le serveur est lancé');
});