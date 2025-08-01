document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
    const summary = document.getElementById("checkout-summary");
    const totalEl = document.getElementById("checkout-total");

    if (cart.length === 0) {
        summary.innerHTML = `<p>Your cart is empty. <a href="index.html">Go back to shop</a></p>`;
        document.getElementById("checkout-form").style.display = "none";
        return;
    }

    const products = [
        {
            id: 1,
            name: "GateGPS Tracker Device (GG402)", price: 24000,
            image: "asset/GateGPS-Tracker-DualCommand-mic.png"
        },
        {
            id: 2,
            name: "GateGPS Tracker Device (GG401)", price: 22000,
            image: "asset/GateGPS-Tracker-DualCommand-NonMic.png"
        },
        {
            id: 3,
            name: "GateGPS Tracker Relay", price: 2500,
            image: "/asset/mini-relay-gps.png"
        },
        {
            id: 4,
            name: "GateGPS Dashcam (GC01)", price: 130000,
            image: "asset/H94bf2b7a629d43faba8099988f8708abo2.png"
        },
        {
            id: 5,
            name: "GateGPS Dashcam (GC02)", price: 120000,
            image: "asset/Dashcam402.png"
        },
        {
            id: 6,
            name: "GateGPS Memory Card",
            image: "asset/GateGps-Dashcam-MemoryCard.png"
        }
    ];

    let subtotal = 0;
    summary.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const price = item.price * item.quantity;
        subtotal += price;
        return `
      <div class="d-flex gap-3 align-items-center border-bottom py-2 checkout-item">
        <img src="${product.image}" alt="${product.name}" style="width: 80px; height: auto;" class="rounded ">

        <div>
          <h6 class="mb-0">${product.name}</h6>
          <p class="mb-0 small text-muted">Qty: ${item.quantity} × ₦${item.price.toLocaleString()}</p>
          <strong>₦${price.toLocaleString()}</strong>
        </div>
      </div>
    `;
    }).join("");

    totalEl.textContent = subtotal.toLocaleString();

    const cartCountEls = document.querySelectorAll("#cart-count, #cart-counts");

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEls.forEach(el => el.textContent = totalItems);
    }

    updateCartCount();

    function calculateDeliveryFee(state) {
        switch (state) {
            case "Lagos":
                return 5000;
          
            case "Others":
                return 7000;
            default:
                return 0;
        }
    }

    document.getElementById("state").addEventListener("change", () => {
        const state = document.getElementById("state").value;
        const deliveryFee = calculateDeliveryFee(state);
        const grandTotal = subtotal + deliveryFee;

        document.getElementById("delivery-fee").textContent = deliveryFee.toLocaleString();
        document.getElementById("final-total").textContent = grandTotal.toLocaleString();
    });

    document.getElementById("checkout-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const state = document.getElementById("state").value;

        const deliveryFee = calculateDeliveryFee(state);
        const total = subtotal + deliveryFee;
        const reference = "GATEGPS-" + Date.now();

        // Update Invoice
        document.getElementById("inv-name").textContent = fullName;
        document.getElementById("inv-email").textContent = email;
        document.getElementById("inv-phone").textContent = phone;
        document.getElementById("inv-address").textContent = address;
        document.getElementById("inv-delivery").textContent = deliveryFee.toLocaleString();
        document.getElementById("inv-subtotal").textContent = subtotal.toLocaleString();
        document.getElementById("inv-total").textContent = total.toLocaleString();
        document.getElementById("invoice").classList.remove("d-none");

        // Paystack Integration
        const handler = PaystackPop.setup({
            key: 'YOUR_PUBLIC_KEY_HERE',
            email: email,
            amount: total * 100,
            currency: "NGN",
            ref: reference,
            callback: function (response) {
                alert("Payment successful! Reference: " + response.reference);

                // WhatsApp auto message
                const message = `*NEW ORDER RECEIVED*\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nOrder:\n${cart.map(item => `• ${item.name} x${item.quantity}`).join("\n")}\nSubtotal: ₦${subtotal.toLocaleString()}\nDelivery: ₦${deliveryFee.toLocaleString()}\nTotal: ₦${total.toLocaleString()}\nRef: ${response.reference}`;
                window.open(`https://wa.me/2348139964679?text=${encodeURIComponent(message)}`, "_blank");

                // Formspree
                fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        phone: phone,
                        address: address,
                        message: message
                    })
                });

                // Your own server
                fetch("/submit-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: fullName,
                        email,
                        phone,
                        address,
                        state,
                        cart,
                        subtotal,
                        deliveryFee,
                        total,
                        reference: response.reference
                    })
                });

                localStorage.removeItem("gategps-cart");
                window.location.href = "thank-you.html";
            },
            onClose: function () {
                alert("Transaction was not completed, window closed.");
            }
        });

        handler.openIframe();
    });
});
