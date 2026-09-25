const checkoutItems = document.getElementById("checkoutItems");
const subtotal = document.getElementById("subtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const placeOrder = document.getElementById("placeOrder");
const successModal = document.getElementById("successModal");

let cart = JSON.parse(localStorage.getItem("gameCart")) || [];

const formatPrice = price =>
    `P${price.toLocaleString("en-PH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;

function saveCart() {
    localStorage.setItem("gameCart", JSON.stringify(cart));
}

function updateTotal() {
    const total = cart.reduce(
        (sum, game) => sum + game.price * game.quantity,
        0
    );

    subtotal.textContent = formatPrice(total);
    checkoutTotal.textContent = formatPrice(total);
}

function renderCheckout() {
    const isEmpty = cart.length === 0;

    placeOrder.disabled = isEmpty;
    placeOrder.style.opacity = isEmpty ? ".5" : "1";

    if (isEmpty) {
        checkoutItems.innerHTML = `
            <div class="empty-checkout">
                <p>Your cart is empty.</p>
            </div>
        `;

        subtotal.textContent = formatPrice(0);
        checkoutTotal.textContent = formatPrice(0);

        return;
    }

    checkoutItems.innerHTML = cart.map(game => `
        <div class="summary-game">
            <img src="${game.image}" alt="${game.name}">

            <div class="summary-game-info">
                <h3>${game.name}</h3>

                <div class="checkout-quantity">
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

                <button
                    class="checkout-remove"
                    data-remove="${game.id}"
                >
                    Remove
                </button>
            </div>

            <span class="summary-game-price">
                ${formatPrice(game.price * game.quantity)}
            </span>
        </div>
    `).join("");

    updateTotal();
}

function changeQuantity(id, amount) {
    const game = cart.find(item => item.id === id);

    if (!game) return;

    game.quantity += amount;

    if (game.quantity <= 0) {
        removeItem(id);
        return;
    }

    saveCart();
    renderCheckout();
}

function removeItem(id) {
    cart = cart.filter(game => game.id !== id);

    saveCart();
    renderCheckout();
}

checkoutItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );

        return;
    }

    if (removeButton) {
        removeItem(Number(removeButton.dataset.remove));
    }
});

placeOrder.addEventListener("click", () => {
    if (!cart.length) return;

    const fields = [
        document.getElementById("email"),
        document.getElementById("firstName"),
        document.getElementById("lastName"),
        document.getElementById("address")
    ];

    const emptyField = fields.find(
        field => !field.value.trim()
    );

    if (emptyField) {
        emptyField.reportValidity();
        return;
    }

    if (!fields[0].checkValidity()) {
        fields[0].reportValidity();
        return;
    }

    localStorage.removeItem("gameCart");
    cart = [];

    successModal.classList.add("show");
    document.body.classList.add("modal-open");
});

renderCheckout();