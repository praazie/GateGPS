document.addEventListener("DOMContentLoaded", () => {
    const cartCountEls = document.querySelectorAll("#cart-count, #cart-counts");
    const addToCartButtons = document.querySelectorAll(".cart-btn");

    // Example product list with minOrder
    const products = [
        { id: 1, name: "GateGPS Tracker Device (GG402)", price: 24000, minOrder: 5 },
        { id: 2, name: "GateGPS Tracker Device (GG401)", price: 22000, minOrder: 5 },
        { id: 3, name: "GateGPS Tracker Relay", price: 2500, minOrder: 1 },
        { id: 4, name: "GateGPS Dashcam (GC01)", price: 130000, minOrder: 1 },
        { id: 5, name: "GateGPS Dashcam (GC02)", price: 120000, minOrder: 1 },
        { id: 6, name: "GateGPS Memory Card", price: 5000, minOrder: 1 }
    ];

    let cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEls.forEach((el) => (el.textContent = totalItems));
    }

    function isInCart(id) {
        return cart.find((item) => item.id === id);
    }

    function addToCart(product) {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        localStorage.setItem("gategps-cart", JSON.stringify(cart));
        updateCartCount();
    }

    addToCartButtons.forEach((btn) => {
        const productCard = btn.closest(".holder");
        const name = productCard.querySelector("p").textContent.trim();
        const priceEl = productCard.querySelector(".new-price");
        const price = parseInt(priceEl.textContent.replace(/[^0-9]/g, ""), 10);
        const id = parseInt(productCard.querySelector("a").href.split("id=")[1], 10);

        const matchedProduct = products.find(p => p.id === id);
        const minOrder = matchedProduct?.minOrder || 1;

        if (isInCart(id)) {
            btn.textContent = "Added to Cart";
            btn.classList.add("btn-success");
        }

        btn.addEventListener("click", () => {
            if (isInCart(id)) return;

            const product = {
                id,
                name,
                price,
                quantity: minOrder,
            };
            addToCart(product);
            btn.textContent = "Added to Cart";
            btn.classList.add("btn-success");
        });
    });

    updateCartCount();
});



const tooltipTriggers = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
const tooltips = tooltipTriggers.map(el => new bootstrap.Tooltip(el));