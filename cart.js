// cart.js

const products = [
    {
        id: 1,
        name: "GateGPS Tracker Device (GG402)",
        price: 24000,
        image: "Asset/GateGPS_Tracker_DualCommand_mic.png"
    },
    {
        id: 2,
        name: "GateGPS Tracker Device (GG401)",
        price: 22000,
        image: "Asset/GateGPS_Tracker_DualCommand_NonMic"
    },
    {
        id: 3,
        name: "GateGPS Tracker Relay",
        price: 2500,
        image: "Asset/mini_relay_gps.png"
    },
    {
        id: 4,
        name: "GateGPS Dashcam (GC01)",
        price: 130000,
        image: "Asset/H94bf2b7a629d43faba8099988f8708abo2.png"
    },
    {
        id: 5,
        name: "GateGPS Dashcam (GC02)",
        price: 120000,
        image: "Asset/Dashcam402.png"
    },
    {
        id: 6,
        name: "GateGPS Memory Card",
        image: "Asset/GateGps_Dashcam_MemoryCard.png"
    }
];

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    const badgeLg = document.getElementById("cart-counts");

    if (badge) badge.textContent = totalCount;
    if (badgeLg) badgeLg.textContent = totalCount;
}

function saveCart(cart) {
    localStorage.setItem("gategps-cart", JSON.stringify(cart));
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-muted">Your cart is empty.</p>`;
        cartTotal.textContent = "0";
        updateCartCount();
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const price = item.price * item.quantity;
        total += price;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item d-flex align-items-center gap-3 border-bottom py-3";

        itemEl.innerHTML = `
  
      <img src="${product.image}" alt="${product.name}" width="80" ">
      <div class="flex-grow-1">
        <h6 class="mb-1">${product.name}</h6>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary decrease">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary increase">+</button>
        </div>
        <p class="mb-0 text-muted small">₦${item.price} each</p>
        <p class="fw-bold mb-0">₦${price.toLocaleString()}</p>
        <button class="btn btn-sm btn-danger mt-2 remove">Remove</button>
      </div>
    
    `;

        // Add event listeners
        itemEl.querySelector(".decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
                saveCart(cart);
                renderCart();
            }
        });

        itemEl.querySelector(".increase").addEventListener("click", () => {
            item.quantity++;
            saveCart(cart);
            renderCart();
        });

        itemEl.querySelector(".remove").addEventListener("click", () => {
            const index = cart.findIndex(p => p.id === item.id);
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
        });

        cartContainer.appendChild(itemEl);
    });

    cartTotal.textContent = total.toLocaleString();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});
