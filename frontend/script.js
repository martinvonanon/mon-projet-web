// =================================================================
//  JAVASCRIPT 100% DEBUTANT - Projet Formulaire d'Inscription
// =================================================================
//  Ce fichier gere le formulaire d'inscription et le tableau.
//  Tout est explique ligne par ligne pour un debutant.
// =================================================================


// -----------------------------------------------------------------
//  ETAPE 1 : Recuperer les elements du HTML
// -----------------------------------------------------------------
//  document.querySelector() permet de chercher un element dans la page
//  On utilise les "selecteurs CSS" :
//    "#nom" cherche un element avec id="nom"
//    "form" cherche la balise <form>
//    "tbody" cherche le <tbody> du tableau

const formulaire = document.querySelector("form");

const champNom = document.querySelector("#nom");
const champPrenom = document.querySelector("#prenom");
const champSexe = document.querySelector("#sexe");
const champTel = document.querySelector("#tel");
const champEmail = document.querySelector("#email");
const champDate = document.querySelector("#date");
const champCelibataire = document.querySelector("#celibataire");
const champMarie = document.querySelector("#marie");
const champDivorce = document.querySelector("#divorce");
const champVeuve = document.querySelector("#veuve");
const champAcceptation = document.querySelector("#acceptation");
const corpsTableau = document.querySelector("tbody");


// -----------------------------------------------------------------
//  ETAPE 2 : Creer un tableau pour stocker les inscriptions
// -----------------------------------------------------------------
//  Un tableau JavaScript est une "liste" qui peut stocker plusieurs
//  valeurs. On commence avec un tableau vide : []
//  Chaque inscription sera un "objet" avec des proprietes.

let inscriptions = [];


// -----------------------------------------------------------------
//  ETAPE 3 : Generer un numero unique pour chaque inscription
// -----------------------------------------------------------------
//  Comme en SQL avec la sequence, on a besoin d'un numero unique.
//  On utilise un compteur qui commence a 1.

let compteurId = 1;


// -----------------------------------------------------------------
//  ETAPE 4 : Ecouter la soumission du formulaire
// -----------------------------------------------------------------
//  addEventListener("submit", ...) ecoute quand l'utilisateur
//  clique sur le bouton "Envoyer".
//  La fonction callback est appelee automatiquement quand ca arrive.
//  L'evenement "e" contient des infos sur ce qui s'est passe.

formulaire.addEventListener("submit", function (e) {

    // PreventDefault empeche la page de se recharger
    // Sans ca, le formulaire rechargerait toute la page
    // et on perdrait toutes les donnees en JavaScript.
    e.preventDefault();


    // -----------------------------------------------------------------
    //  ETAPE 5 : Recuperer les valeurs saisies par l'utilisateur
    // -----------------------------------------------------------------
    //  .value donne le texte que l'utilisateur a tape dans un champ.
    //  Pour les radio buttons, on verifie lequel est coche
    //  avec .checked.

    const nom = champNom.value.trim();
    const prenom = champPrenom.value.trim();
    const sexe = champSexe.value;
    const tel = champTel.value.trim();
    const email = champEmail.value.trim();
    const date = champDate.value;


    // Pour les radio buttons (statut matrimonial), on verifie
    // quel bouton est coche avec .checked
    let statut = "";

    if (champCelibataire.checked) {
        statut = "Celibataire";
    } else if (champMarie.checked) {
        statut = "Marie(e)";
    } else if (champDivorce.checked) {
        statut = "Divorce(e)";
    } else if (champVeuve.checked) {
        statut = "Veuf / Veuve";
    }


    // -----------------------------------------------------------------
    //  ETAPE 6 : Valider les champs du formulaire
    // -----------------------------------------------------------------
    //  On verifie que l'utilisateur a rempli tous les champs
    //  et que la case acceptation est cochee.
    //  Si un champ est vide, on affiche une alerte et on arrete.

    if (!nom || !prenom || !sexe || !tel || !email || !date) {
        alert("Veuillez remplir tous les champs du formulaire !");
        return;  // Arrete la fonction ici
    }

    if (!champAcceptation.checked) {
        alert("Veuillez accepter les conditions !");
        return;
    }


    // -----------------------------------------------------------------
    //  ETAPE 7 : Creer un objet inscription
    // -----------------------------------------------------------------
    //  Un objet JavaScript est comme un dictionnaire :
    //  il a des "cles" (noms) et des "valeurs".
    //  Exemple : { nom: "Dupont", prenom: "Jean" }

    const inscription = {
        id: compteurId,
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        tel: tel,
        email: email,
        date: date,
        statut: statut
    };


    // -----------------------------------------------------------------
    //  ETAPE 8 : Ajouter l'inscription dans le tableau
    // -----------------------------------------------------------------
    //  push() ajoute un element a la fin du tableau.

    inscriptions.push(inscription);


    // -----------------------------------------------------------------
    //  ETAPE 9 : Mettre a jour le compteur d'ID
    // -----------------------------------------------------------------
    //  ++ ajoute 1 au compteur (compteurId = compteurId + 1)

    compteurId++;


    // -----------------------------------------------------------------
    //  ETAPE 10 : Afficher le tableau
    // -----------------------------------------------------------------
    //  On appelle la fonction qui met a jour le tableau HTML.

    afficherTableau();


    // -----------------------------------------------------------------
    //  ETAPE 11 : Envoyer les donnees au serveur (backend)
    // -----------------------------------------------------------------
    //  fetch() envoie des donnees au serveur.
    //  C'est comme envoyer une lettre : on envoie les donnees
    //  et on attend une reponse.

    envoyerAuServeur(inscription);


    // -----------------------------------------------------------------
    //  ETAPE 12 : Vider le formulaire
    // -----------------------------------------------------------------
    //  .reset() vide tous les champs du formulaire.

    formulaire.reset();
});


// -----------------------------------------------------------------
//  FONCTION : Afficher le tableau avec toutes les inscriptions
// -----------------------------------------------------------------
//  Cette fonction met a jour le HTML du tableau.
//  Elle vide le tableau puis le remplit avec les donnees actuelles.

function afficherTableau() {

    // .innerHTML = "" vide le contenu du tbody
    corpsTableau.innerHTML = "";

    // La boucle "for" parcourt chaque inscription du tableau.
    // inscriptions.length donne le nombre d'inscriptions.
    for (let i = 0; i < inscriptions.length; i++) {

        // On recupere l'inscription courante
        const inscription = inscriptions[i];

        // On cree une nouvelle ligne <tr>
        const ligne = document.createElement("tr");

        // On construit le contenu de la ligne avec les donnees
        // Template literal (backticks ``) permet d'inserer des
        // variables avec ${variable}
        ligne.innerHTML = `
            <td>${inscription.nom}</td>
            <td>${inscription.prenom}</td>
            <td>${inscription.sexe}</td>
            <td>${inscription.tel}</td>
            <td>${inscription.email}</td>
            <td>${inscription.date}</td>
            <td>${inscription.statut}</td>
            <td>
                <button class="btn-modifier" onclick="modifierInscription(${inscription.id})">
                    Modifier
                </button>
            </td>
            <td>
                <button class="btn-supprimer" onclick="supprimerInscription(${inscription.id})">
                    Supprimer
                </button>
            </td>
        `;

        // On ajoute la ligne au corps du tableau
        corpsTableau.appendChild(ligne);
    }
}


// -----------------------------------------------------------------
//  FONCTION : Modifier une inscription
// -----------------------------------------------------------------
//  Cette fonction charge les donnees d'une inscription
//  dans le formulaire pour pouvoir les modifier.

function modifierInscription(id) {

    // On cherche l'inscription avec l'id correspondant
    // find() parcourt le tableau et retourne la premiere
    // inscription dont l'id correspond
    const inscription = inscriptions.find(function (inscr) {
        return inscr.id === id;
    });

    // Si on ne trouve pas l'inscription, on arrete
    if (!inscription) {
        return;
    }

    // On remplit le formulaire avec les donnees existantes
    champNom.value = inscription.nom;
    champPrenom.value = inscription.prenom;
    champSexe.value = inscription.sexe;
    champTel.value = inscription.tel;
    champEmail.value = inscription.email;
    champDate.value = inscription.date;

    // On coche le bon radio button selon le statut
    if (inscription.statut === "Celibataire") {
        champCelibataire.checked = true;
    } else if (inscription.statut === "Marie(e)") {
        champMarie.checked = true;
    } else if (inscription.statut === "Divorce(e)") {
        champDivorce.checked = true;
    } else if (inscription.statut === "Veuf / Veuve") {
        champVeuve.checked = true;
    }

    // On coche la case acceptation
    champAcceptation.checked = true;

    // On supprime l'ancienne inscription du tableau
    // filter() cree un nouveau tableau sans l'element supprime
    inscriptions = inscriptions.filter(function (inscr) {
        return inscr.id !== id;
    });

    // On met a jour le compteur ID si besoin
    // On met a jour le tableau affiche
    afficherTableau();

    // On scrolle vers le formulaire
    formulaire.scrollIntoView({ behavior: "smooth" });
}


// -----------------------------------------------------------------
//  FONCTION : Supprimer une inscription
// -----------------------------------------------------------------
//  Cette fonction supprime une inscription du tableau.

function supprimerInscription(id) {

    // confirm() affiche une boite de dialogue avec OK / Annuler
    // Si l'utilisateur clique OK, on continue.
    // Si l'utilisateur clique Annuler, on arrete.
    const confirmation = confirm("Voulez-vous vraiment supprimer cette inscription ?");

    if (!confirmation) {
        return;
    }

    // On filtre le tableau pour garder toutes les inscriptions
    // SAUF celle avec l'id correspondant
    inscriptions = inscriptions.filter(function (inscr) {
        return inscr.id !== id;
    });

    // On met a jour le tableau affiche
    afficherTableau();

    // On notifie le serveur de la suppression
    supprimerDuServeur(id);
}


// -----------------------------------------------------------------
//  FONCTION : Envoyer les donnees au serveur
// -----------------------------------------------------------------
//  fetch() envoie une requete HTTP au serveur.
//  C'est comme remplir un formulaire en ligne :
//  - On envoie les donnees (POST)
//  - Le serveur les traite et repond

function envoyerAuServeur(inscription) {

    // fetch() prend 2 parametres :
    // 1. L'URL du serveur
    // 2. Les options de la requete (methode, donnees, etc.)

    fetch("http://localhost:3000/api/inscriptions", {
        // La methode POST signifie "creer une nouvelle ressource"
        method: "POST",

        // Les en-tetes indiquent le type de donnees envoyees
        // On envoie du JSON (format de texte structure)
        headers: {
            "Content-Type": "application/json"
        },

        // JSON.stringify() convertit l'objet JavaScript en texte JSON
        // Par exemple : { nom: "Dupont" } devient '{"nom":"Dupont"}'
        body: JSON.stringify(inscription)
    })

    // .then() est appele quand le serveur a repondu
    // response.json() convertit la reponse en objet JavaScript
    .then(function (response) {
        return response.json();
    })

    // .then() est appele avec la reponse convertie
    .then(function (data) {
        console.log("Inscription envoyee au serveur :", data);
    })

    // .catch() est appele en cas d'erreur
    // Par exemple si le serveur est eteint
    .catch(function (erreur) {
        console.log("Erreur lors de l'envoi :", erreur);
        // Pas grave : les donnees sont deja affichees localement
    });
}


// -----------------------------------------------------------------
//  FONCTION : Supprimer du serveur
// -----------------------------------------------------------------
//  Cette fonction envoie une requete de suppression au serveur.

function supprimerDuServeur(id) {

    fetch("http://localhost:3000/api/inscriptions/" + id, {
        method: "DELETE"
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("Inscription supprimee :", data);
    })
    .catch(function (erreur) {
        console.log("Erreur lors de la suppression :", erreur);
    });
}


// -----------------------------------------------------------------
//  FONCTION : Charger les inscriptions au demarrage
// -----------------------------------------------------------------
//  Quand la page se charge, on demande au serveur toutes les
//  inscriptions existantes pour les afficher dans le tableau.

function chargerInscriptions() {

    fetch("http://localhost:3000/api/inscriptions")
    .then(function (response) {
        return response.json();
    })
    .then(function (donnees) {

        // On remplace notre tableau local par les donnees du serveur
        inscriptions = donnees;

        // On met a jour le compteur ID
        // On cherche le plus grand ID et on ajoute 1
        for (let i = 0; i < inscriptions.length; i++) {
            if (inscriptions[i].id >= compteurId) {
                compteurId = inscriptions[i].id + 1;
            }
        }

        // On affiche le tableau
        afficherTableau();
    })
    .catch(function (erreur) {
        console.log("Impossible de charger les donnees du serveur :", erreur);
        console.log("Le mode local est actif.");
    });
}


// -----------------------------------------------------------------
//  Demarrage : charger les inscriptions quand la page est prete
// -----------------------------------------------------------------
//  C'est la premiere chose qui se passe quand on ouvre la page.

chargerInscriptions();
