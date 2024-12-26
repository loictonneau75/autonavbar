/**
 * Crée une navbar Bootstrap complète et l'ajoute au document.
 * @param {Array} siteInfo - Tuple contenant le nom du site (string) et l'URL de la marque (string).
 * @param {string} logoUrl - URL de l'image du logo. Si vide, le nom du site est affiché.
 * @param {Array} categories - Liste des catégories (chaque catégorie est un tuple : [nom, url, sous-catégories?]).
 */
export function createNavbar(siteInfo, logoUrl, categories) {
    const navbar = createNavbarContainer();
    const brand = createBrand(siteInfo, logoUrl);
    const toggleButton = createToggleButton();
    const navbarContent = createNavbarContent(categories);
    const rightAlignedLinks = createRightAlignedLinks(); // Crée les boutons
    navbar.appendChild(brand);
    navbar.appendChild(toggleButton);
    navbar.appendChild(navbarContent);
    navbarContent.appendChild(rightAlignedLinks); // Ajoute les boutons dans le menu collapsible
    document.body.prepend(navbar);
}

/**
 * Crée un conteneur pour la navbar avec les classes Bootstrap nécessaires.
 * @returns {HTMLElement} Élément \<nav> configuré.
 */
function createNavbarContainer() {
    const navbar = document.createElement("nav");
    navbar.className = "navbar sticky-top navbar-expand-lg navbar-light bg-transparent";
    return navbar;
}

/**
 * Crée l'élément de la marque affichant un logo ou le nom du site.
 * @param {Array} siteInfo - Tuple contenant le nom du site (string) et l'URL de la marque (string).
 * @param {string} logoUrl - URL de l'image du logo.
 * @param {string} [height="30px"] - Taille de l'image du logo.
 * @returns {HTMLElement} Élément \<a> configuré.
 */
function createBrand(siteInfo, logoUrl, height = "30px") {
    const [siteName, brandUrl] = siteInfo; // Déstructure le tuple
    const brand = document.createElement("a");
    brand.className = "navbar-brand";
    brand.href = brandUrl || "#"; // Si aucune URL n'est fournie, utilise "#"
    if (logoUrl) {
        const logo = document.createElement("img");
        logo.src = logoUrl;
        logo.alt = siteName;
        logo.style.height = height; // Taille du logo
        brand.appendChild(logo);
    } else {
        brand.textContent = siteName;
    }
    return brand;
}

/**
 * Crée un bouton pour afficher/cacher la navbar sur les petits écrans.
 * @returns {HTMLElement} Élément \<button> configuré.
 */
function createToggleButton() {
    const toggleButton = document.createElement("button");
    toggleButton.className = "navbar-toggler";
    toggleButton.type = "button";
    toggleButton.setAttribute("data-bs-toggle", "collapse");
    toggleButton.setAttribute("data-bs-target", "#navbarContent");
    toggleButton.innerHTML = `<span class="navbar-toggler-icon"></span>`;
    return toggleButton;
}

/**
 * Crée le conteneur principal pour les éléments de navigation.
 * @param {Array} categories - Liste des catégories et sous-catégories.
 * @returns {HTMLElement} Élément \<div> configuré.
 */
function createNavbarContent(categories) {
    const navbarContent = document.createElement("div");
    navbarContent.className = "collapse navbar-collapse";
    navbarContent.id = "navbarContent";
    const navList = createNavList(categories);
    navbarContent.appendChild(navList);
    return navbarContent;
}

/**
 * Génère la liste principale des catégories pour la navbar.
 * @param {Array} categories - Liste des catégories et sous-catégories.
 * @returns {HTMLElement} Élément \<ul> contenant les catégories.
 */
function createNavList(categories) {
    const navList = document.createElement("ul");
    navList.className = "navbar-nav me-auto mb-2 mb-lg-0";
    categories.forEach(([name, url, subcategories]) => {
        const navItem = subcategories && subcategories.length > 0
            ? createDropdownItem(name, url, subcategories, navList)
            : createNavItem(name, url);
        navList.appendChild(navItem);
    });
    return navList;
}

/**
 * Crée un élément simple pour une catégorie sans sous-catégories.
 * @param {string} name - Nom de la catégorie.
 * @param {string} url - Lien de la catégorie.
 * @returns {HTMLElement} Élément \<li> contenant le lien.
 */
function createNavItem(name, url) {
    const navItem = document.createElement("li");
    navItem.className = "nav-item";
    const navLink = document.createElement("a");
    navLink.className = "nav-link";
    navLink.href = url;
    navLink.textContent = name;
    navItem.appendChild(navLink);
    return navItem;
}

/**
 * Crée un élément de navigation avec dropdown.
 * Si une URL est fournie, un lien principal est ajouté avant le dropdown.
 * Sinon, le dropdown inclut directement le texte du nom principal.
 * @param {string} name - Nom de la catégorie.
 * @param {string|null} url - Lien principal de la catégorie (peut être null).
 * @param {Array} subcategories - Liste des sous-catégories (tuples [nom, url]).
 * @returns {HTMLElement} Élément <li> contenant le dropdown.
 */
function createDropdownItem(name, url, subcategories, navlist) {
    const navItem = document.createElement("li");
    navItem.className = "nav-item dropdown";
    // Élément principal du dropdown
    const mainElement = document.createElement("a");
    mainElement.className = "nav-link dropdown-toggle";
    mainElement.href = "#";
    mainElement.id = `${name}-dropdown`;
    mainElement.setAttribute("role", "button");
    mainElement.setAttribute("data-bs-toggle", "dropdown");
    // Texte du dropdown (seulement si aucune URL fournie)
    if (!url) {
        mainElement.textContent = name;
    }else{
        // Cas où une URL est fournie
        const mainLink = createNavItem(name, url); // Lien principal
        navlist.appendChild(mainLink); // Ajoute le lien principal avant la flèche
    }
    // Ajout du bouton dropdown
    navItem.appendChild(mainElement);
    // Ajout du menu dropdown
    const dropdownMenu = createDropdownMenu(name, subcategories);
    navItem.appendChild(dropdownMenu);
    return navItem;
}

/**
 * Crée un élément de navigation pour une catégorie avec des sous-catégories.
 * @param {string} name - Nom de la catégorie.
 * @param {string} url - Lien principal de la catégorie.
 * @param {Array} subcategories - Liste des sous-catégories (tuples [nom, url]).
 * @returns {HTMLElement} Élément \<li> contenant le dropdown.
 */
function createDropdownMenu(name, subcategories) {
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.setAttribute("aria-labelledby", `${name}-dropdown`);
    subcategories.forEach(([subName, subUrl]) => {
        const dropdownItem = document.createElement("li");
        const dropdownLink = document.createElement("a");
        dropdownLink.className = "dropdown-item";
        dropdownLink.href = subUrl;
        dropdownLink.textContent = subName;
        dropdownItem.appendChild(dropdownLink);
        dropdownMenu.appendChild(dropdownItem);
    });
    return dropdownMenu;
}

/**
 * Crée un conteneur pour les liens à droite de la navbar (inscription et connexion).
 * @returns {HTMLElement} Élément <div> contenant les boutons.
 */
function createRightAlignedLinks() {
    const rightContainer = document.createElement("div");
    rightContainer.className = "d-flex flex-column flex-lg-row mt-3 mt-lg-0"; // Aligne verticalement sur petits écrans

    const registerLink = document.createElement("a");
    registerLink.className = "btn btn-outline-primary me-lg-2 mb-2 mb-lg-0"; // Espace ajusté pour petits écrans
    registerLink.href = "#register";
    registerLink.textContent = "S'enregistrer";

    const loginLink = document.createElement("a");
    loginLink.className = "btn btn-primary"; // Style Bootstrap pour bouton
    loginLink.href = "#login";
    loginLink.textContent = "Se connecter";

    rightContainer.appendChild(registerLink);
    rightContainer.appendChild(loginLink);
    return rightContainer;
}

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.classList.add("bg-light", "navbar-shrink");
      navbar.classList.remove("bg-transparent");
    } else {
      navbar.classList.add("bg-transparent");
      navbar.classList.remove("bg-light", "navbar-shrink");
    }
  });