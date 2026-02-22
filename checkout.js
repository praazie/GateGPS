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
        { id: 1, name: "GateGPS Tracker Device (GG402)", price: 24000, image: "Asset/GateGPS_Tracker_DualCommand_mic.png" },
        { id: 2, name: "GateGPS Tracker Device (GG401)", price: 22000, image: "Asset/GateGPSTrackerDualCommandNonMic.png", imageClass: "customImg-gg401" },
        { id: 3, name: "GateGPS Tracker Relay", price: 2500, image: "Asset/mini_relay_gps.png" },
        { id: 4, name: "GateGPS Dashcam (GC01)", price: 130000, image: "Asset/H94bf2b7a629d43faba8099988f8708abo2.png" },
        { id: 5, name: "GateGPS Dashcam (GC02)", price: 120000, image: "Asset/Dashcam402.png" },
        { id: 6, name: "GateGPS Memory Card", image: "Asset/GateGps_Dashcam_MemoryCard.png" }
    ];

    let subtotal = 0;
    summary.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const price = item.price * item.quantity;
        subtotal += price;
        return `
            <div class="d-flex gap-3 align-items-center border-bottom py-2 checkout-item">
                
<img 
  src="${product.image}" 
  alt="${product.name}" 
  style="width: 80px;" 
  class="rounded ${product.imageClass || ''}"
>

                <div>
                    <h6 class="mb-0">${product.name}</h6>
                    <p class="mb-0 small text-muted">Qty: ${item.quantity} × ₦${item.price.toLocaleString()}</p>
                    <strong>₦${price.toLocaleString()}</strong>
                </div>
            </div>
        `;
    }).join("");

    totalEl.textContent = subtotal.toLocaleString();

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll("#cart-count, #cart-counts").forEach(el => el.textContent = totalItems);
    }
    updateCartCount();

    function calculateDeliveryFee(state) {
        switch (state) {
            case "Lagos": return 7000;
            case "Others": return 10000;
            default: return 0;
        }
    }

    document.getElementById("state").addEventListener("change", () => {
        const state = document.getElementById("state").value;
        const deliveryFee = calculateDeliveryFee(state);
        const grandTotal = subtotal + deliveryFee;

        document.getElementById("delivery-fee").textContent = deliveryFee.toLocaleString();
        document.getElementById("final-total").textContent = grandTotal.toLocaleString();
    });


    function printInvoice() {
        const modal = document.getElementById("paymentModal");
        modal.style.display = "none";   // Hide modal
        window.print();
        modal.style.display = "flex";   // Show modal again
    }


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

        // ✅ Update Invoice
        document.getElementById("inv-name").textContent = fullName;
        document.getElementById("inv-email").textContent = email;
        document.getElementById("inv-phone").textContent = phone;
        document.getElementById("inv-address").textContent = address;
        document.getElementById("inv-delivery").textContent = deliveryFee.toLocaleString();
        document.getElementById("inv-subtotal").textContent = subtotal.toLocaleString();
        document.getElementById("inv-total").textContent = total.toLocaleString();
        document.getElementById("invoice").classList.remove("d-none");

        // ✅ Detect platform
        const waBase = "whatsapp://send?phone=";
        // ✅ WhatsApp message for Owner
        const ownerMessage = `🚨 NEW ORDER RECEIVED 🚨
Status: Payment Pending ❌

👤 Name: ${fullName}
📞 Phone: ${phone}
📧 Email: ${email}
🏠 Address: ${address}

🛒 Items Ordered:
${cart.map(item => `• ${item.name} x${item.quantity}`).join("\n")}

💵 Subtotal: ₦${subtotal.toLocaleString()}
🚚 Delivery: ₦${deliveryFee.toLocaleString()}
💳 Total: ₦${total.toLocaleString()}

Ref: ${reference}
⚠️ Awaiting payment confirmation.`;

        const customerMessage = `✅ Thank you for your order with GateGPS!

Your Order Ref: ${reference}

🛒 Items Ordered:
${cart.map(item => `• ${item.name} x${item.quantity}`).join("\n")}

💵 Total: ₦${total.toLocaleString()} (including delivery)

🏦 Please make your payment to:
Bank: ACCESS BANK
Account Name: NNAEMEKA CHIBUIKE
Account Number: 1505790238

⚠️ Your order will not be shipped until we receive your payment.`;

        // ✅ Show modal
        document.getElementById("amountToPay").textContent = total.toLocaleString();
        document.getElementById("paymentRef").textContent = reference;
        document.getElementById("paymentModal").style.display = "flex";


        // 💳 Paystack Button
        document.getElementById("payWithPaystack").onclick = function () {

            const handler = PaystackPop.setup({
                key: "YOUR_PUBLIC_KEY_HERE",
                email: email,
                amount: total * 100,
                currency: "NGN",
                ref: reference,

                callback: function (response) {

                    alert("Payment successful!");

                    printInvoice();


                    const paidOwnerMessage = `✅ NEW ORDER (PAID)

👤 ${fullName}
📞 ${phone}
💵 ₦${total.toLocaleString()}
Ref: ${response.reference}`;

                    const ownerURL = `https://wa.me/2348139964679?text=${encodeURIComponent(paidOwnerMessage)}`;
                    window.location.href = ownerURL;

                    localStorage.removeItem("gategps-cart");
                },

                onClose: function () {
                    console.log("Payment window closed.");
                }
            });

            handler.openIframe();
        };


























        // ✅ Copy account number
        document.getElementById("copyAccountBtn").onclick = () => {
            const accNum = document.getElementById("accountNumber").textContent;
            navigator.clipboard.writeText(accNum);
            alert("Account number copied!");
        };

        // ✅ Continue to WhatsApp
        document.getElementById("continueWhatsApp").onclick = () => {

            printInvoice();

            const ownerURL = `${waBase}2348139964679&text=${encodeURIComponent(ownerMessage)}`;
            window.location.href = ownerURL;

            setTimeout(() => {
                const customerURL = `${waBase}${phone}&text=${encodeURIComponent(customerMessage)}`;
                window.location.href = customerURL;
            }, 2500);

            setTimeout(() => {
                localStorage.removeItem("gategps-cart");
                window.location.href = "store.html";
            }, 7000);
        };
    });
});
