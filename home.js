document.addEventListener('DOMContentLoaded', function () {
  const heroCarousel = document.querySelector('#heroCarousel');
  new bootstrap.Carousel(heroCarousel, {
    interval: 3000,
    ride: 'carousel',
    pause: false,
    touch: true
  });
});



const viewMoreBtn = document.querySelector('.view-more-btn');
const moreInstallers = document.querySelector('#moreInstallers');

viewMoreBtn.addEventListener('click', function () {
  const isHidden = moreInstallers.classList.contains('d-none');

  if (isHidden) {
    moreInstallers.classList.remove('d-none');
    moreInstallers.classList.add('animate__animated', 'animate__fadeIn');
    viewMoreBtn.textContent = 'View Less';
  } else {
    moreInstallers.classList.add('d-none');
    viewMoreBtn.textContent = 'View More';
  }
});

const cartCountEls = document.querySelectorAll("#cart-count, #cart-counts");

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("gategps-cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEls.forEach(el => el.textContent = totalItems);
}

updateCartCount();