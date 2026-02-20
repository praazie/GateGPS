const products = [
  {
    id: 1,
    name: "GateGPS Tracker Device (GG402)",
    price: 24000,
    oldPrice: 25000,
    image: "Asset/GateGPS_Tracker_DualCommand_mic.png",
    minOrder: 5,
    imageClass: "custom-img-gg402",
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
      { label: "Waterproof rating", value: "IP6" }
    ]
  },
  {
    id: 2,
    name: "GateGPS Tracker Device (GG401)",
    price: 22000,
    oldPrice: 23000,
    image: "Asset/GateGPS_Tracker_DualCommand_NonMic.png",
    imageClass: "custom-img-gg401",
    minOrder: 5,
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
      { label: "Waterproof rating", value: "IP6" }
    ]
  },
  {
    id: 3,
    name: "GateGPS Tracker Relay",
    price: 2500,
    image: "Asset/mini_relay_gps.png",
    minOrder: 1,
    imageClass: "custom-img-relay",
  },
  {
    id: 4,
    name: "GateGPS Dashcam (GC01)",
    price: 130000,
    oldPrice: 150000,
    image: "Asset/H94bf2b7a629d43faba8099988f8708abo2.png",
    minOrder: 1,
    imageClass: "custom-img-401",
  },
  {
    id: 5,
    name: "GateGPS Dashcam (GC02)",
    price: 120000,
    image: "Asset/Dashcam402.png",
    minOrder: 1,
    imageClass: "custom-img-402",
  },
  {
    id: 6,
    name: "GateGPS Memory Card",
    priceOptions: [
      { size: "32GB", price: 5000 },
      { size: "64GB", price: 9000 },
      { size: "128GB", price: 13000 }
    ],
    image: "Asset/GateGps_Dashcam_MemoryCard.png",
    minOrder: 1,
    imageClass: "custom-img-card",
  }
];

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badgeMobile = document.getElementById("cart-count");
  const badgeDesktop = document.getElementById("cart-counts");

  if (badgeMobile) badgeMobile.textContent = totalCount;
  if (badgeDesktop) badgeDesktop.textContent = totalCount;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product = products.find(p => p.id === productId);
  const container = document.getElementById("product-detail");

  if (!product || !container) return;

  const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
  const cartItem = cart.find(item => item.id === product.id);

  let currentQuantity = cartItem ? cartItem.quantity : (product.minOrder || 1);
  let unitPrice = product.priceOptions ? product.priceOptions[0].price : product.price;

  const specificationHTML = product.specifications ? `
    <h5>Specifications:</h5>
    <ul>
      ${product.specifications.map(spec => `<li><strong>${spec.label}:</strong> ${spec.value}</li>`).join("")}
    </ul>
  ` : "";

  const priceOptionsHTML = product.priceOptions ? `
    <div class="mb-3">
      <label><strong>Select Storage Size:</strong></label>
      <div class="btn-group" role="group">
        ${product.priceOptions.map((opt, index) => `
          <button type="button" class="btn variant-btn memory-btn ${index === 0 ? 'active' : ''}" data-price="${opt.price}">
            ${opt.size}
          </button>
        `).join('')}
      </div>
    </div>
  ` : "";

  container.innerHTML = `
    <div class="col-md-6 shadow py-5 d-flex align-item-center justify-content-center g-2 position-relative">

     ${product.minOrder && product.minOrder > 1
      ? `<span class="moq-badge" 
            data-bs-toggle="tooltip" 
            data-bs-placement="left" 
            title="Minimum Order Quantity: You must buy at least ${product.minOrder} units.">
        MOQ ${product.minOrder}
     </span>`

      : ""}

     <img src="${product.image}" class="img-fluid ${product.imageClass || ''}"  alt="${product.name}">



    </div>
    <div class="col-md-6 mt-3 mt-lg-0">
      <h3>${product.name}</h3>
      ${specificationHTML}
      ${priceOptionsHTML}
      <p class="price fs-4">Price: <strong>&#8358;<span id="price">${unitPrice * currentQuantity}</span></strong></p>
      <div class="d-flex align-items-center mb-3">
        <button class="btn variant-btn" id="decrease">-</button>
        <input type="text" id="quantity" value="${currentQuantity}" class="form-control mx-2" style="width:60px;" readonly>
        <button class="btn variant-btn" id="increase">+</button>
      </div>
      <button class="btn btn-primary addToCart w-100" id="add-to-cart">${cartItem ? "View Cart" : "Add To Cart"}</button>
    </div>
  `;

  const tooltipTriggers = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
  tooltipTriggers.forEach(el => new bootstrap.Tooltip(el));




  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");
  const quantityInput = document.getElementById("quantity");
  const priceDisplay = document.getElementById("price");
  const addToCartBtn = document.getElementById("add-to-cart");

  decreaseBtn.addEventListener("click", () => {
    const minOrder = product.minOrder || 1;
    if (currentQuantity > minOrder) {
      currentQuantity--;
      quantityInput.value = currentQuantity;
      priceDisplay.textContent = currentQuantity * unitPrice;
      updateProductInCart();
    }
  });

  increaseBtn.addEventListener("click", () => {
    currentQuantity++;
    quantityInput.value = currentQuantity;
    priceDisplay.textContent = currentQuantity * unitPrice;
    updateProductInCart();
  });

  if (product.priceOptions) {
    document.querySelectorAll(".memory-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".memory-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        unitPrice = parseInt(btn.dataset.price);
        priceDisplay.textContent = unitPrice * currentQuantity;
        updateProductInCart();
      });
    });
  }

  addToCartBtn.addEventListener("click", () => {
    if (addToCartBtn.textContent === "View Cart") {
      window.location.href = "cart.html";
      return;
    }

    const newCart = cart.filter(item => item.id !== product.id);
    newCart.push({
      id: product.id,
      name: product.name,
      price: unitPrice,
      quantity: currentQuantity
    });

    localStorage.setItem("gategps-cart", JSON.stringify(newCart));
    updateCartCount();

    addToCartBtn.textContent = "View Cart";
    addToCartBtn.classList.remove("btn-primary");
    addToCartBtn.classList.add("btn-success");
  });

  // ✅ Live cart updater for + / - buttons
  function updateProductInCart() {
    const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);

    const newItem = {
      id: product.id,
      name: product.name,
      price: unitPrice,
      quantity: currentQuantity
    };

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? newItem : item
      );
    } else {
      updatedCart = [...cart, newItem];
    }

    localStorage.setItem("gategps-cart", JSON.stringify(updatedCart));
    updateCartCount();
  }

  updateCartCount();
});


