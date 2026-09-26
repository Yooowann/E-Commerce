const checkoutItems = document.getElementById("checkoutItems");
const subtotal = document.getElementById("subtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const placeOrder = document.getElementById("placeOrder");
const successModal = document.getElementById("successModal");
const backToStore = document.getElementById("backToStore");

let cart = JSON.parse(localStorage.getItem("gameCart")) || [];

const formatPrice = price =>
    `P${Number(price).toLocaleString("en-PH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;

function saveCart() {
    localStorage.setItem("gameCart", JSON.stringify(cart));
}

function updateTotal() {
    const total = cart.reduce(
        (sum, game) => sum + Number(game.price) * Number(game.quantity),
        0
    );

    subtotal.textContent = formatPrice(total);
    checkoutTotal.textContent = formatPrice(total);
}

function renderCheckout() {
    const isEmpty = cart.length === 0;

    placeOrder.disabled = isEmpty;
    placeOrder.style.opacity = isEmpty ? "0.5" : "1";
    placeOrder.style.cursor = isEmpty ? "not-allowed" : "pointer";

    if (isEmpty) {
        checkoutItems.innerHTML = `
            <div class="empty-checkout">
                <p>Your cart is empty.</p>
                <button type="button" onclick="window.location.href='index.html'">
                    Continue Shopping
                </button>
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
                        type="button"
                        data-quantity="${game.id}"
                        data-change="-1"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>

                    <span>${game.quantity}</span>

                    <button
                        type="button"
                        data-quantity="${game.id}"
                        data-change="1"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    class="checkout-remove"
                    data-remove="${game.id}"
                >
                    Remove
                </button>
            </div>

            <span class="summary-game-price">
                ${formatPrice(Number(game.price) * Number(game.quantity))}
            </span>
        </div>
    `).join("");

    updateTotal();
}

function changeQuantity(id, amount) {
    const game = cart.find(item => Number(item.id) === Number(id));

    if (!game) return;

    game.quantity = Number(game.quantity) + Number(amount);

    if (game.quantity <= 0) {
        removeItem(id);
        return;
    }

    saveCart();
    renderCheckout();
}

function removeItem(id) {
    cart = cart.filter(game => Number(game.id) !== Number(id));

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

    const emptyField = fields.find(field => !field.value.trim());

    if (emptyField) {
        emptyField.reportValidity();
        emptyField.focus();
        return;
    }

    const email = fields[0];

    if (!email.checkValidity()) {
        email.reportValidity();
        email.focus();
        return;
    }

    localStorage.removeItem("gameCart");
    cart = [];

    renderCheckout();

    successModal.classList.add("show");
    document.body.classList.add("modal-open");
});

if (backToStore) {
    backToStore.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

renderCheckout();
