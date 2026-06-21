// // Project section
// const titles = document.querySelectorAll(".project-title");

// titles.forEach(title => {

//     title.addEventListener("click", () => {

//         const card = title.parentElement;

//         card.classList.toggle("active");

//     });

// });

// // Themes section

// const themesLink = document.getElementById("themes-link");
// const themesMenu = document.getElementById("themes-menu");
// const closeButton = document.getElementById("close-themes-menu");

// themesLink.addEventListener("click", e => {

//     e.preventDefault();

//     themesMenu.classList.add("open");

// });

// closeButton.addEventListener("click", () => {

//     themesMenu.classList.remove("open");

// });

// ===== THEME SYSTEM =====

const THEME_MAP = {
    "default-theme": "default",
    "midnight-theme": "midnight",
    "forest-theme": "forest",
    "sunset-theme": "sunset",
    "ocean-theme": "ocean",
    "cherry-theme": "cherry",
    "sakura-theme": "sakura",
};

function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("portfolio-theme", themeName);
    updateActiveThemeCard(themeName);
}

function updateActiveThemeCard(themeName) {
    document.querySelectorAll(".theme-card").forEach(card => {
        card.classList.remove("active-theme");
    });

    for (const [cardId, name] of Object.entries(THEME_MAP)) {
        if (name === themeName) {
            document.getElementById(cardId)?.classList.add("active-theme");
            break;
        }
    }
}

function initTheme() {
    const saved = localStorage.getItem("portfolio-theme") || "default";
    applyTheme(saved);
}

// Wire up Apply Theme buttons
document.querySelectorAll(".theme-button").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".theme-card");
        const themeName = THEME_MAP[card.id];
        if (themeName) applyTheme(themeName);
    });
});

// ===== PROJECTS ACCORDION =====
document.querySelectorAll(".project-title").forEach(title => {
    title.addEventListener("click", () => {
        const card = title.closest(".project-card");
        card.classList.toggle("active");
    });
});

// ===== THEMES MENU =====
const themesMenu = document.getElementById("themes-menu");

document.getElementById("themes-link").addEventListener("click", (e) => {
    e.preventDefault();
    themesMenu.classList.add("open");
});

document.getElementById("close-themes-menu").addEventListener("click", () => {
    themesMenu.classList.remove("open");
});

// Close if clicking outside the menu
document.addEventListener("click", (e) => {
    if (
        themesMenu.classList.contains("open") &&
        !themesMenu.contains(e.target) &&
        e.target.id !== "themes-link"
    ) {
        themesMenu.classList.remove("open");
    }
});

// Run on page load
initTheme();