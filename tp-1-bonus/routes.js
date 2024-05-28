module.exports = {

    declareRoutes : (app) => {
        app.get('/articles', (request, response) => {
            response.json("Retournera la liste des articles");
        });
        
        app.get('/article/:id', (request, response) => {
        
            // récupérer un param d'url
            const id = request.params.id;
        
            // String template
            return response.json(`Retournera un article ayant l'id ${id}`);
        });
        
        app.post('/save-article', (request, response) => {
            return response.json("Va créer ou mettre à jour un article envoyé");
        });
        
        app.delete('/delete-article/:id', (request, response) => {
        
            // récupérer un param d'url
            const id = request.params.id;
        
            return response.json(`Supprimera un article par l'id ${id}`);
        });
    }
}