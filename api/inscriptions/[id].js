// =================================================================
//  API SERVERLESS - PUT et DELETE /api/inscriptions/:id
// =================================================================
//  Ce fichier gere les requetes PUT (modifier) et DELETE (supprimer)
//  pour une inscription specifique via Supabase PostgreSQL.
// =================================================================

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(request, response) {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        response.status(200).end();
        return;
    }

    // On recupere l'id dans l'URL : /api/inscriptions/5 --> id = 5
    const { id } = request.query;

    // ---------------------------------------------------------
    //  PUT : Modifier une inscription
    // ---------------------------------------------------------
    if (request.method === "PUT") {
        try {
            const { nom, prenom, sexe, tel, email, date, statut } = request.body;

            const resultat = await pool.query(
                `UPDATE inscription
                 SET nom = $1, prenom = $2, sexe = $3, tel = $4,
                     email = $5, datenaiss = $6, statut = $7
                 WHERE id = $8
                 RETURNING *`,
                [nom, prenom, sexe, tel, email, date, statut, id]
            );

            if (resultat.rows.length === 0) {
                response.status(404).json({ erreur: "Inscription non trouvee" });
            } else {
                response.status(200).json(resultat.rows[0]);
            }
        } catch (erreur) {
            console.log("Erreur PUT :", erreur.message);
            response.status(500).json({ erreur: "Erreur modification" });
        }
        return;
    }

    // ---------------------------------------------------------
    //  DELETE : Supprimer une inscription
    // ---------------------------------------------------------
    if (request.method === "DELETE") {
        try {
            const resultat = await pool.query(
                "DELETE FROM inscription WHERE id = $1 RETURNING *",
                [id]
            );

            if (resultat.rows.length === 0) {
                response.status(404).json({ erreur: "Inscription non trouvee" });
            } else {
                response.status(200).json({ message: "Inscription supprimee" });
            }
        } catch (erreur) {
            console.log("Erreur DELETE :", erreur.message);
            response.status(500).json({ erreur: "Erreur suppression" });
        }
        return;
    }
};
