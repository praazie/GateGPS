document.addEventListener('DOMContentLoaded', function () {
    const heroCarousel = document.querySelector('#heroCarousel');
    new bootstrap.Carousel(heroCarousel, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        touch: true
    });
});


document.getElementById("appDownload").addEventListener("click", function () {
    window.open("https://philadgate.github.io/gategps-redirect/", "_blank");
});