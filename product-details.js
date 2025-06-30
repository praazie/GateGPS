const productList = [
  {
    id: 1,
    name: "GateGPS Tracker Device (GG402)",
    price: "24000",
    oldPrice: "25000",
    image: "asset/GateGPS Tracker Dual Command mic.png",
    specifications: [
      { label: "Size", value: "70 mm x 10 mm x 13 mm" },
      { label: "Weight", value: "35g" },
      { label: "Battery life", value: "55 - 1212 hours" },
      { label: "GPS sensitivity", value: "Tracking: -165 dBm" },
      { label: "Position accuracy", value: "5 m" },
      { label: "Working voltage", value: "9–95 V" },
      { label: "GSM", value: "850 / 900 / 1800 / 1900 Quad band" },
      { label: "GPRS", value: "Class12, TCP / IP" },
      { label: "Working current", value: "22 mA (DC12 V), 12 mA (DC24 V)" },
      { label: "GPS locating time", value: "Cold start 32 seconds (open sky)" },

    ]
  },
  {
    id: 2,
    name: "GateGPS Tracker Device (GG401)",
    price: "22000",
    oldPrice: "23000",
    image: "asset/GateGPS Tracker Dual Command Non Mic.png"
  },
  {
    id: 3,
    name: "GateGPS Relay",
    price: "2500",
    image: "asset/mini-relay-gps.png"
  },
  {
    id: 4,
    name: "GateGPS Dashcam (GC01)",
    price: "130000",
    oldPrice: "150000",
    image: "asset/H94bf2b7a629d43faba8099988f8708abo 2.png"
  },
  {
    id: 5,
    name: "GateGPS Dashcam (GC02)",
    price: "120000",
    image: "asset/Dashcam 402.png"
  },
  {
    id: 6,
    name: "GateGPS Memory Card",
    prices: {
      "32GB": 5000,
      "64GB": 9000,
      "128GB": 13000
    },
    image: "asset/GateGps Dashcam Memory Card.png",
    defaultVariant: "32GB"
  }
];

// Get product ID
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));
const product = productList.find(p => p.id === productId);
const container = document.getElementById("product-detail");

if (product) {
  const trackersWithMinQty5 = [1, 2]; // GG402 and GG401
  const minQty = trackersWithMinQty5.includes(product.id) ? 5 : 1

  let unitPrice = 0;
  let selectedVariant = "";

  const hasVariants = product.prices !== undefined;

  if (hasVariants) {
    selectedVariant = product.defaultVariant;
    unitPrice = product.prices[selectedVariant];
  } else {
    unitPrice = parseInt(product.price);
  }

  // Specifications (if any)
  let specsList = "";
  if (product.specifications && product.specifications.length > 0) {
    specsList = `
      <h5 class="mt-4 mb-2">Specifications:</h5>
      <ul class="list-group mb-4">
        ${product.specifications.map(spec => `
          <li class="list-group-item d-flex justify-content-between">
            <strong>${spec.label}</strong> <span>${spec.value}</span>
          </li>
        `).join("")}
      </ul>
    `;
  }

  // Variant selector (for TF card)
  let variantSelector = "";
  if (hasVariants) {
    variantSelector = `
      <div class="mb-3">
        <label class="form-label fw-semibold">Select Size:</label>
        <div class="btn-group" role="group">
          ${Object.keys(product.prices).map(size => `
            <button type="button" class="btn btn-outline-primary variant-btn ${size === selectedVariant ? 'active' : ''}" data-size="${size}">
              ${size}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Inject into HTML
  container.innerHTML = `
    <div class="col-md-6 mb-4">
      <img src="${product.image}" class="img-fluid rounded shadow" alt="${product.name}">
    </div>
    <div class="col-md-6">
      <h2 class="fw-bold">${product.name}</h2>

      ${specsList}
      ${variantSelector}

      <p class="fs-5 text-muted mb-0">Unit Price: ₦<span id="unitPrice">${unitPrice.toLocaleString()}</span></p>
      <p class="fs-4 text-success fw-semibold">
        Total: ₦<span id="totalPrice">${(unitPrice * minQty).toLocaleString()}</span>
      </p>

      <div class="input-group mb-3 mt-4" style="max-width: 160px;">
        <button class="btn btn-outline-secondary" type="button" id="decreaseBtn">−</button>
        <input type="number" class="form-control text-center" id="quantityInput" value="${minQty}" min="${minQty}">
        <button class="btn btn-outline-secondary" type="button" id="increaseBtn">+</button>
      </div>

      <button class="btn btn-primary w-100 addToCart">Add to Cart</button>
    </div>
  `;

  // Event listeners
  const qtyInput = document.getElementById("quantityInput");
  const unitPriceDisplay = document.getElementById("unitPrice");
  const totalPrice = document.getElementById("totalPrice");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");

  function updateTotal() {
    const qty = parseInt(qtyInput.value);
    totalPrice.textContent = (qty * unitPrice).toLocaleString();
    unitPriceDisplay.textContent = unitPrice.toLocaleString();
  }

  increaseBtn.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateTotal();
  });

  decreaseBtn.addEventListener("click", () => {
    if (parseInt(qtyInput.value) > minQty) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
      updateTotal();
    }
  });

  qtyInput.addEventListener("input", () => {
    if (qtyInput.value < minQty) qtyInput.value = minQty;
    updateTotal();
  });

  // Handle variant selection
  if (hasVariants) {
    const variantButtons = document.querySelectorAll(".variant-btn");
    variantButtons.forEach(button => {
      button.addEventListener("click", () => {
        variantButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const newVariant = button.getAttribute("data-size");
        selectedVariant = newVariant;
        unitPrice = product.prices[newVariant];
        updateTotal();
      });
    });
  }

} else {
  container.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-danger">Product not found.</p>
    </div>
  `;
}
