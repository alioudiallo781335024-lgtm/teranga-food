// ========================================
// 1. CONFIGURATION WHATSAPP
// ========================================

// Remplace le numéro ci-dessous par ton numéro WhatsApp.
// Exemple : 221771234567
// N'utilise ni +, ni espaces, ni tirets.

const numeroWhatsApp = "221781335024";


// ========================================
// 2. RÉCUPÉRATION DES ÉLÉMENTS HTML
// ========================================

const boutonsCommande = document.querySelectorAll(".order-btn");
const champRecherche = document.getElementById("searchInput");
const boutonsCategories = document.querySelectorAll(".category-btn");
const cartesPlats = document.querySelectorAll(".food-card");
const messageAucunResultat = document.getElementById("noResults");


// ========================================
// 3. ANNÉE AUTOMATIQUE DANS LE FOOTER
// ========================================

const annee = document.getElementById("currentYear");

if (annee) {
    annee.textContent = new Date().getFullYear();
}


// ========================================
// 4. RECHERCHE ET FILTRES
// ========================================

let categorieActive = "tous";

function filtrerPlats() {
    const recherche = champRecherche.value
        .trim()
        .toLowerCase();

    let nombrePlatsVisibles = 0;

    cartesPlats.forEach(function (carte) {
        const nomPlat = carte.dataset.name.toLowerCase();
        const categoriePlat = carte.dataset.category;

        const correspondRecherche = nomPlat.includes(recherche);

        const correspondCategorie =
            categorieActive === "tous" ||
            categoriePlat === categorieActive;

        const afficher =
            correspondRecherche && correspondCategorie;

        carte.hidden = !afficher;

        if (afficher) {
            nombrePlatsVisibles++;
        }
    });

    messageAucunResultat.hidden = nombrePlatsVisibles !== 0;
}


// Recherche pendant la saisie.
if (champRecherche) {
    champRecherche.addEventListener("input", filtrerPlats);
}


// Changement de catégorie.
boutonsCategories.forEach(function (bouton) {
    bouton.addEventListener("click", function () {

        categorieActive = bouton.dataset.category;

        boutonsCategories.forEach(function (autreBouton) {
            autreBouton.classList.remove("active");
        });

        bouton.classList.add("active");

        filtrerPlats();
    });
});


// ========================================
// 5. CRÉATION DU PANIER
// ========================================

const panier = {};


// Ajouter un plat au panier.
function ajouterAuPanier(nom, prix) {

    if (panier[nom]) {
        panier[nom].quantite++;
    } else {
        panier[nom] = {
            prix: prix,
            quantite: 1
        };
    }

    afficherPanier();
}


// Modifier la quantité d'un plat.
function modifierQuantite(nom, variation) {

    if (!panier[nom]) {
        return;
    }

    panier[nom].quantite += variation;

    if (panier[nom].quantite <= 0) {
        delete panier[nom];
    }

    afficherPanier();
}


// Calculer le total.
function calculerTotal() {

    let total = 0;

    for (const nom in panier) {
        total += panier[nom].prix * panier[nom].quantite;
    }

    return total;
}


// Formater les montants en FCFA.
function formaterPrix(prix) {
    return prix.toLocaleString("fr-FR") + " FCFA";
}


// ========================================
// 6. AFFICHAGE DU PANIER
// ========================================

function afficherPanier() {

    const listePanier = document.getElementById("cartItems");
    const totalPanier = document.getElementById("cartTotal");
    const nombrePanier = document.getElementById("cartCount");

    if (!listePanier || !totalPanier || !nombrePanier) {
        return;
    }

    listePanier.replaceChildren();

    let nombreArticles = 0;

    for (const nom in panier) {

        const article = panier[nom];

        nombreArticles += article.quantite;

        const ligne = document.createElement("div");
        ligne.className = "cart-item";

        const informations = document.createElement("div");

        const titre = document.createElement("strong");
        titre.textContent = nom;

        const prix = document.createElement("p");
        prix.textContent =
            formaterPrix(article.prix * article.quantite);

        informations.append(titre, prix);

        const commandesQuantite = document.createElement("div");
        commandesQuantite.className = "quantity-controls";

        const boutonMoins = document.createElement("button");
        boutonMoins.type = "button";
        boutonMoins.textContent = "−";
        boutonMoins.setAttribute(
            "aria-label",
            "Retirer une unité de " + nom
        );

        boutonMoins.addEventListener("click", function () {
            modifierQuantite(nom, -1);
        });

        const quantite = document.createElement("span");
        quantite.textContent = article.quantite;

        const boutonPlus = document.createElement("button");
        boutonPlus.type = "button";
        boutonPlus.textContent = "+";
        boutonPlus.setAttribute(
            "aria-label",
            "Ajouter une unité de " + nom
        );

        boutonPlus.addEventListener("click", function () {
            modifierQuantite(nom, 1);
        });

        commandesQuantite.append(
            boutonMoins,
            quantite,
            boutonPlus
        );

        ligne.append(informations, commandesQuantite);
        listePanier.appendChild(ligne);
    }

    if (nombreArticles === 0) {
        const message = document.createElement("p");
        message.textContent = "Votre panier est vide.";
        listePanier.appendChild(message);
    }

    nombrePanier.textContent = nombreArticles;

    totalPanier.textContent = formaterPrix(calculerTotal());
}


// ========================================
// 7. CRÉER LA ZONE DU PANIER
// ========================================

function creerZonePanier() {

    const menuSection = document.getElementById("menu");

    if (!menuSection || document.getElementById("cartSection")) {
        return;
    }

    const sectionPanier = document.createElement("section");

    sectionPanier.id = "cartSection";
    sectionPanier.className = "cart-section container";

    const titre = document.createElement("h2");
    titre.textContent = "Mon panier ";

    const compteur = document.createElement("span");
    compteur.id = "cartCount";
    compteur.textContent = "0";

    titre.appendChild(compteur);

    const liste = document.createElement("div");
    liste.id = "cartItems";
    liste.className = "cart-items";

    const ligneTotal = document.createElement("p");
    ligneTotal.className = "cart-total-line";

    const texteTotal = document.createElement("strong");
    texteTotal.textContent = "Total : ";

    const total = document.createElement("strong");
    total.id = "cartTotal";
    total.textContent = "0 FCFA";

    ligneTotal.append(texteTotal, total);

    const boutonCommander = document.createElement("button");

    boutonCommander.type = "button";
    boutonCommander.id = "checkoutButton";
    boutonCommander.className = "btn";
    boutonCommander.textContent = "Commander le panier sur WhatsApp";

    boutonCommander.addEventListener("click", envoyerPanierWhatsApp);

    sectionPanier.append(
        titre,
        liste,
        ligneTotal,
        boutonCommander
    );

    menuSection.querySelector(".container").appendChild(sectionPanier);

    afficherPanier();
}


// ========================================
// 8. ENVOYER LE PANIER SUR WHATSAPP
// ========================================

function envoyerPanierWhatsApp() {

    if (Object.keys(panier).length === 0) {
        alert("Votre panier est vide. Ajoutez d'abord un plat.");
        return;
    }

    if (numeroWhatsApp.includes("X")) {
        alert(
            "Configure d'abord le numéro WhatsApp dans script.js."
        );
        return;
    }

    let message = "Bonjour TERANGA FOOD ! 🍔\n\n";
    message += "Je souhaite commander :\n\n";

    for (const nom in panier) {

        const article = panier[nom];

        message +=
            "• " + nom +
            " x " + article.quantite +
            " = " +
            formaterPrix(article.prix * article.quantite) +
            "\n";
    }

    message += "\nTOTAL : " + formaterPrix(calculerTotal());
    message += "\n\nMerci !";

    const url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


// ========================================
// 9. BOUTONS COMMANDER DES PLATS
// ========================================

boutonsCommande.forEach(function (bouton) {

    bouton.addEventListener("click", function () {

        const nomPlat = bouton.dataset.plat;
        const prixPlat = Number(bouton.dataset.prix);

        if (!nomPlat || !Number.isFinite(prixPlat) || prixPlat <= 0) {
            alert("Une erreur est survenue avec ce plat.");
            return;
        }

        ajouterAuPanier(nomPlat, prixPlat);

        const panierSection = document.getElementById("cartSection");

        if (panierSection) {
            panierSection.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    });
});


// ========================================
// 10. INITIALISATION
// ========================================

creerZonePanier();
filtrerPlats();