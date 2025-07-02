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

    let total = 0;
    summary.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const price = item.price * item.quantity;
        total += price;
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

    totalEl.textContent = total.toLocaleString();



    const cartCountEls = document.querySelectorAll("#cart-count, #cart-counts");

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEls.forEach(el => el.textContent = totalItems);
    }

    updateCartCount();

    // Form submit
    document.getElementById("checkout-form").addEventListener("submit", function (e) {
        e.preventDefault();

        // Get values
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const reference = "GATEGPS-" + Date.now();

        // 🟩 Paystack payment
        const handler = PaystackPop.setup({
            key: 'YOUR_PUBLIC_KEY_HERE', // ⬅️ Replace with your Paystack public key
            email: email,
            amount: total * 100, // in kobo
            currency: "NGN",
            ref: reference,
            callback: function (response) {
                alert("Payment successful! Reference: " + response.reference);

                // 🟩 WhatsApp auto message
                const message = `*NEW ORDER RECEIVED*
Name: ${fullName}
Phone: ${phone}
Email: ${email}
Address: ${address}
Order:
${cart.map(item => `• ${item.name} x${item.quantity}`).join("\n")}
Total: ₦${total.toLocaleString()}
Ref: ${response.reference}`;
                window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${encodeURIComponent(message)}`, "_blank");

                // 🟩 Send to Formspree
                fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        phone: phone,
                        address: address,
                        message: message
                    }),
                });

                // 🟩 Send to your own server (optional)
                fetch("/submit-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: fullName,
                        email,
                        phone,
                        address,
                        cart,
                        total,
                        reference: response.reference
                    }),
                });

                // 🟩 Clear cart & redirect
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
