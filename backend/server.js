// =================================================================
//  SERVEUR EXPRESS - Projet Formulaire d'Inscription
// =================================================================
//  Ce fichier cree un serveur web qui gere les inscriptions.
//  Tout est explique ligne par ligne pour un debutant.
// =================================================================


// -----------------------------------------------------------------
//  ETAPE 1 : Importer les modules necessaires
// -----------------------------------------------------------------
//  require() importe un module externe.
//  C'est comme dire "j'ai besoin de cet outil".
//
//  express = framework pour creer des serveurs web
//  pg = connecteur PostgreSQL (pour la base de donnees)
//  cors = permet a differentes parties de communiquer
//  path = gere les chemins de fichiers

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");


// -----------------------------------------------------------------
//  ETAPE 2 : Creer l'application Express
// -----------------------------------------------------------------
//  express() cree une instance de l'application.
//  C'est comme allumer un serveur vide, pret a recevoir des requetes.

const app = express();


// -----------------------------------------------------------------
//  ETAPE 3 : Configurer le serveur
// -----------------------------------------------------------------
//  app.use() ajoute un "middleware".
//  Un middleware est une fonction qui s'execute AVANT chaque requete.

//  cors() autorise le frontend a communiquer avec le backend
//  Sinon, le navigateur bloquerait les requetes pour des raisons securite.
app.use(cors());

//  express.json() analyse les donnees envoyees en JSON
//  Quand le frontend envoie des donnees avec fetch(), elles arrivent
//  en texte. Ce middleware les convertit en objet JavaScript.
app.use(express.json());

//  On sert les fichiers du dossier "frontend" pour que le
//  navigateur puisse afficher la page web.
app.use(express.static(path.join(__dirname, "..", "frontend")));


// -----------------------------------------------------------------
//  ETAPE 4 : Configurer la connexion a PostgreSQL
// -----------------------------------------------------------------
//  Pool = un groupe de connexions a la base de donnees.
//  C'est plus efficace que d'ouvrir/fermer une connexion a chaque fois.
//
//  process.env DATABASE_URL est la variable d'environnement fournie
//  par Railway. En local, on utilise les valeurs par defaut.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/inscription_db",
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});


// -----------------------------------------------------------------
//  ETAPE 5 : Tester la connexion a la base de donnees
// -----------------------------------------------------------------
//  On essaie de se connecter au demarrage pour verifier que
//  tout fonctionne.

pool.connect()
    .then(function () {
        console.log("Connecte a PostgreSQL avec succes !");
    })
    .catch(function (erreur) {
        console.log("Erreur de connexion a PostgreSQL :", erreur.message);
        console.log("Le serveur demarre quand meme...");
    });


// -----------------------------------------------------------------
//  ETAPE 6 : Definir les routes de l'API
// -----------------------------------------------------------------
//  Une "route" est un chemin URL que le frontend peut appeler.
//  Par exemple : GET /api/inscriptions
//
//  Les methodes HTTP principales :
//    GET    = Lire des donnees
//    POST   = Creer des donnees
//    PUT    = Modifier des donnees
//    DELETE = Supprimer des donnees


// -----------------------------------------------------------------
//  ROUTE 1 : GET /api/inscriptions
//  Lire toutes les inscriptions
// -----------------------------------------------------------------

app.get("/api/inscriptions", async function (request, response) {

    try {
        // On execute une requete SQL pour recuperer toutes les lignes
        // de la table "inscription", triees par id
        const resultat = await pool.query(
            "SELECT * FROM inscription ORDER BY id"
        );

        // .rows contient les donnees recuperees
        // On les envoie au frontend en JSON
        response.json(resultat.rows);

    } catch (erreur) {
        console.log("Erreur GET :", erreur.message);
        response.status(500).json({
            erreur: "Erreur lors de la lecture des inscriptions"
        });
    }
});


// -----------------------------------------------------------------
//  ROUTE 2 : POST /api/inscriptions
//  Creer une nouvelle inscription
// -----------------------------------------------------------------

app.post("/api/inscriptions", async function (request, response) {

    try {
        // request.body contient les donnees envoyees par le frontend
        // Exemple : { nom: "Dupont", prenom: "Jean", ... }
        const { nom, prenom, sexe, tel, email, date, statut } = request.body;

        // On execute une requete SQL INSERT INTO pour ajouter
        // la nouvelle ligne dans la table.
        // $1, $2, etc. sont des parametres securises (evitent les injections SQL)
        const resultat = await pool.query(
            `INSERT INTO inscription (nom, prenom, sexe, tel, email, datenaiss, statut)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nom, prenom, sexe, tel, email, date, statut]
        );

        // On envoie la ligne creee en reponse (avec l'id genere)
        response.status(201).json(resultat.rows[0]);

    } catch (erreur) {
        console.log("Erreur POST :", erreur.message);
        response.status(500).json({
            erreur: "Erreur lors de la creation de l'inscription"
        });
    }
});


// -----------------------------------------------------------------
//  ROUTE 3 : PUT /api/inscriptions/:id
//  Modifier une inscription existante
// -----------------------------------------------------------------

app.put("/api/inscriptions/:id", async function (request, response) {

    try {
        // request.params.id recupere l'id dans l'URL
        // Par exemple : /api/inscriptions/5 --> id = 5
        const id = request.params.id;
        const { nom, prenom, sexe, tel, email, date, statut } = request.body;

        const resultat = await pool.query(
            `UPDATE inscription
             SET nom = $1, prenom = $2, sexe = $3, tel = $4,
                 email = $5, datenaiss = $6, statut = $7
             WHERE id = $8
             RETURNING *`,
            [nom, prenom, sexe, tel, email, date, statut, id]
        );

        // Si aucune ligne n'a ete modifiee, l'id n'existe pas
        if (resultat.rows.length === 0) {
            response.status(404).json({
                erreur: "Inscription non trouvee"
            });
        } else {
            response.json(resultat.rows[0]);
        }

    } catch (erreur) {
        console.log("Erreur PUT :", erreur.message);
        response.status(500).json({
            erreur: "Erreur lors de la modification"
        });
    }
});


// -----------------------------------------------------------------
//  ROUTE 4 : DELETE /api/inscriptions/:id
//  Supprimer une inscription
// -----------------------------------------------------------------

app.delete("/api/inscriptions/:id", async function (request, response) {

    try {
        const id = request.params.id;

        const resultat = await pool.query(
            "DELETE FROM inscription WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultat.rows.length === 0) {
            response.status(404).json({
                erreur: "Inscription non trouvee"
            });
        } else {
            response.json({
                message: "Inscription supprimee avec succes"
            });
        }

    } catch (erreur) {
        console.log("Erreur DELETE :", erreur.message);
        response.status(500).json({
            erreur: "Erreur lors de la suppression"
        });
    }
});


// -----------------------------------------------------------------
//  ETAPE 7 : Demarrer le serveur
// -----------------------------------------------------------------
//  app.listen() lance le serveur sur un port.
//  Le frontend fera des requetes vers http://localhost:3000

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("========================================");
    console.log("  Serveur demarre sur http://localhost:" + PORT);
    console.log("========================================");
});
