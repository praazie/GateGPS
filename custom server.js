
document.getElementById("server-request-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("companyName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const devices = document.getElementById("devices").value.trim();
    const message = document.getElementById("message").value.trim();

    const text = `🚀 Custom Server Access Request
🏢 Company: ${name}
📧 Email: ${email}
📞 Phone: ${phone}
📍 Location: ${location}
📦 Estimated Devices: ${devices}

📝 Message:
${message}`;

    // Open WhatsApp for GateGPS Admin
    window.open(`https://wa.me/2348139964679?text=${encodeURIComponent(text)}`, "_blank");
});
