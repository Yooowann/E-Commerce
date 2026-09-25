const games = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        category: "action",
        price: 2695,
        tag: "Popular",
        platform: "PC, PS5, Xbox",
        description: "Step into Night City as V, a mercenary caught in a dangerous world of cyberware, crime, corporations and high-tech chaos. Make choices, take on deadly jobs and shape your own story.",
        image: "assets/cyber.webp"
    },
    {
        id: 2,
        name: "Elden Ring",
        category: "rpg",
        price: 2595,
        tag: "Top Rated",
        platform: "PC, PS5, Xbox",
        description: "Explore the vast and mysterious Lands Between, battle terrifying enemies and powerful bosses, discover hidden secrets, and forge your own path as a Tarnished.",
        image: "assets/elden.jpg"
    },
    {
        id: 3,
        name: "The Last of Us Part 1",
        category: "adventure",
        price: 2550,
        tag: "Sale",
        platform: "PC, PS5",
        description: "Survive a devastating outbreak and journey across a dangerous, post-apocalyptic America as Joel and Ellie. Fight infected and hostile survivors while building a powerful bond.",
        image: "assets/tlou.jpg"
    },
    {
        id: 4,
        name: "Pokemon Pokopia",
        category: "adventure",
        price: 3850,
        tag: "Popular",
        platform: "Nintendo Switch 2",
        description: "Build, explore and create your own adventure in a colorful world filled with Pokémon. Gather resources, shape the environment and discover new ways to make the world your own.",
        image: "assets/pok.jpg"
    },
    {
        id: 5,
        name: "NBA 2K27",
        category: "sports",
        price: 4390,
        tag: "Popular",
        platform: "PC, PS5, Xbox",
        description: "Take your basketball career to the next level with competitive gameplay, realistic NBA action and multiple game modes. Build your player and compete against the best on the court.",
        image: "assets/nba.jpg"
    },
    {
        id: 6,
        name: "Life is Strange Reunion",
        category: "adventure",
        price: 2150,
        tag: "New",
        platform: "PC, PS5",
        description: "Return to the emotional world of Life is Strange in a story-driven adventure filled with difficult choices, meaningful relationships and mysterious events that can change everything.",
        image: "assets/lis.jpg"
    },
    {
        id: 7,
        name: "Minecraft",
        category: "adventure",
        price: 1750,
        tag: "Sale",
        platform: "PC, Xbox",
        description: "Explore endless worlds, gather resources, build incredible creations and survive dangerous nights. Play your way through a limitless sandbox where your imagination sets the rules.",
        image: "assets/mc.jpg"
    },
    {
        id: 8,
        name: "Donkey Kong Bananza",
        category: "adventure",
        price: 3850,
        tag: "New",
        platform: "Nintendo Switch 2",
        description: "Join Donkey Kong on a wild platforming adventure packed with explosive action, destructible environments, hidden secrets and challenging levels as you smash your way through the underground world.",
        image: "assets/dk.png"
    },
    {
        id: 9,
        name: "Resident Evil Requiem",
        category: "horror",
        price: 2995,
        tag: "Popular",
        platform: "PC, PS5, Xbox",
        description: "Enter a terrifying new chapter of the Resident Evil series. Explore a dangerous world, uncover dark secrets, solve challenging puzzles and fight horrifying enemies as you struggle to survive.",
        image: "assets/re9.jpg"
    },
    {
        id: 10,
        name: "Grand Theft Auto VI",
        category: "action",
        price: 4990,
        tag: "Coming Soon",
        platform: "PS5, Xbox",
        description: "Return to the legendary state of Vice City in an enormous open-world adventure. Follow an unforgettable criminal duo through a story of crime, ambition and chaos across Leonida.",
        image: "assets/gta6.webp"
    },
    {
        id: 11,
        name: "PRAGMATA",
        category: "action",
        price: 2995,
        tag: "Sale",
        platform: "PC, PS5, Xbox, Nintendo Switch 2",
        description: "Journey through a mysterious lunar research facility as Hugh and Diana in a sci-fi action-adventure combining intense combat, exploration, puzzles and a unique hacking system.",
        image: "assets/pragmata.jpg"
    },
    {
        id: 12,
        name: "Forza Horizon 6",
        category: "racing",
        price: 3495,
        tag: "New",
        platform: "PC, Xbox, PS5",
        description: "Experience the Horizon Festival in Japan with an enormous open world, hundreds of cars, dynamic seasons, intense races and a wide variety of driving experiences.",
        image: "assets/forza.jpg"
    }
];

const $ = id => document.getElementById(id);

let cart = JSON.parse(localStorage.getItem("gameCart")) || [];
let currentCategory = "all";
let selectedGameId = null;
let toastTimer;

const gameGrid = $("gameGrid");
const cartItems = $("cartItems");
const cartCount = $("cartCount");
const cartTotal = $("cartTotal");
const cartSidebar = $("cartSidebar");
const cartOverlay = $("cartOverlay");
const searchInput = $("searchInput");
const toast = $("toast");
const gameModal = $("gameModal");

const modalImage = $("modalImage");
const modalGenre = $("modalGenre");
const modalTitle = $("modalTitle");
const modalDescription = $("modalDescription");
const modalGenreDetail = $("modalGenreDetail");
const modalPlatform = $("modalPlatform");
const modalPrice = $("modalPrice");

const formatPrice = price =>
    `P${price.toLocaleString("en-PH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;

function saveCart() {
    localStorage.setItem("gameCart", JSON.stringify(cart));
}

function renderGames() {
    const search = searchInput.value.trim().toLowerCase();

    const filteredGames = games.filter(game => {
        const matchesCategory =
            currentCategory === "all" ||
            game.category === currentCategory;

        const matchesSearch =
            game.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (!filteredGames.length) {
        gameGrid.innerHTML = `
            <div class="empty-checkout">
                <h2>No games found</h2>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    gameGrid.innerHTML = filteredGames.map(game => `
        <article class="game-card" data-id="${game.id}">
            <div class="game-image">
                <img src="${game.image}" alt="${game.name}">
                <span class="game-tag">${game.tag}</span>
            </div>

            <div class="game-info">
                <span class="game-genre">${game.category}</span>

                <h3 class="game-name">${game.name}</h3>

                <div class="game-bottom">
                    <span class="price">${formatPrice(game.price)}</span>
                    <button class="add-btn" data-add="${game.id}" aria-label="Add ${game.name} to cart">
                        +
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function updateCart() {
    const count = cart.reduce(
        (sum, game) => sum + game.quantity,
        0
    );

    const total = cart.reduce(
        (sum, game) => sum + game.price * game.quantity,
        0
    );

    cartCount.textContent = count;
    cartTotal.textContent = formatPrice(total);

    if (!cart.length) {
        cartItems.innerHTML =
            '<div class="empty-cart">Your cart is empty.</div>';
        return;
    }

    cartItems.innerHTML = cart.map(game => `
        <div class="cart-item">
            <img src="${game.image}" alt="${game.name}">

            <div class="cart-item-info">
                <h3>${game.name}</h3>

                <div class="cart-item-price">
                    ${formatPrice(game.price * game.quantity)}
                </div>

                <div class="quantity">
                    <button
                        data-quantity="${game.id}"
                        data-change="-1"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>

                    <span>${game.quantity}</span>

                    <button
                        data-quantity="${game.id}"
                        data-change="1"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <button class="remove-btn" data-remove="${game.id}">
                    Remove
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(id) {
    const game = games.find(item => item.id === id);

    if (!game) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...game,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
    showToast("Game added to cart");
}

function changeQuantity(id, amount) {
    const game = cart.find(item => item.id === id);

    if (!game) return;

    game.quantity += amount;

    if (game.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(game => game.id !== id);

    saveCart();
    updateCart();
}

function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");

    if (!gameModal.classList.contains("show")) {
        document.body.classList.remove("modal-open");
    }
}

function openGameModal(id) {
    const game = games.find(item => item.id === id);

    if (!game) return;

    selectedGameId = id;

    modalImage.src = game.image;
    modalImage.alt = game.name;
    modalGenre.textContent = game.category;
    modalTitle.textContent = game.name;
    modalDescription.textContent = game.description;
    modalGenreDetail.textContent = game.category;
    modalPlatform.textContent = game.platform;
    modalPrice.textContent = formatPrice(game.price);

    gameModal.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeGameModal() {
    gameModal.classList.remove("show");

    if (!cartSidebar.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function updateSearchDisplay() {
    const search = searchInput.value.trim();
    const hero = document.querySelector(".hero");

    hero.style.display = search ? "none" : "flex";

    if (search) {
        $("games").scrollIntoView({
            behavior: "smooth"
        });
    }

    renderGames();
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")?.classList.remove("active");

        button.classList.add("active");
        currentCategory = button.dataset.category;

        renderGames();
    });
});

gameGrid.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        event.stopPropagation();
        addToCart(Number(addButton.dataset.add));
        return;
    }

    const card = event.target.closest(".game-card");

    if (card) {
        openGameModal(Number(card.dataset.id));
    }
});

cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

$("searchBtn").addEventListener("click", updateSearchDisplay);

searchInput.addEventListener("input", () => {
    const search = searchInput.value.trim();

    if (search) {
        document.querySelector(".hero").style.display = "none";
        renderGames();
    } else {
        document.querySelector(".hero").style.display = "flex";
        renderGames();
    }
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        updateSearchDisplay();
    }
});

$("exploreBtn").addEventListener("click", () => {
    $("games").scrollIntoView({
        behavior: "smooth"
    });
});

$("dealsBtn").addEventListener("click", () => {
    $("games").scrollIntoView({
        behavior: "smooth"
    });
});

$("modalClose").addEventListener("click", closeGameModal);

gameModal.addEventListener("click", event => {
    if (event.target === gameModal) {
        closeGameModal();
    }
});

$("modalCartBtn").addEventListener("click", () => {
    if (!selectedGameId) return;

    addToCart(selectedGameId);
    closeGameModal();
});

$("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }

    window.location.href = "checkout.html";
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeGameModal();
        closeCart();
    }
});

renderGames();
updateCart();