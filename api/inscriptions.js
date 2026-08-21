// =================================================================
//  API SERVERLESS - GET et POST /api/inscriptions
// =================================================================
//  Ce fichier gere les requetes GET (lire) et POST (creer)
//  pour les inscriptions via Supabase PostgreSQL.
// =================================================================

const { Pool } = require("pg");

// Connexion a Supabase PostgreSQL
// DATABASE_URL est une variable d'environnement definie sur Vercel
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(request, response) {

    // Headers CORS pour autoriser le frontend a communiquer
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Reponse preflight (verification CORS)
    if (request.method === "OPTIONS") {
        response.status(200).end();
        return;
    }

    // ---------------------------------------------------------
    //  GET : Lire toutes les inscriptions
    // ---------------------------------------------------------
    if (request.method === "GET") {
        try {
            const resultat = await pool.query(
                "SELECT * FROM inscription ORDER BY id"
            );
            response.status(200).json(resultat.rows);
        } catch (erreur) {
            console.log("Erreur GET :", erreur.message);
            response.status(500).json({ erreur: "Erreur lecture inscriptions" });
        }
        return;
    }

    // ---------------------------------------------------------
    //  POST : Creer une nouvelle inscription
    // ---------------------------------------------------------
    if (request.method === "POST") {
        try {
            const { nom, prenom, sexe, tel, email, date, statut } = request.body;

            const resultat = await pool.query(
                `INSERT INTO inscription (nom, prenom, sexe, tel, email, datenaiss, statut)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [nom, prenom, sexe, tel, email, date, statut]
            );

            response.status(201).json(resultat.rows[0]);
        } catch (erreur) {
            console.log("Erreur POST :", erreur.message);
            response.status(500).json({ erreur: "Erreur creation inscription" });
        }
        return;
    }
};
