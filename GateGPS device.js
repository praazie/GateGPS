document.addEventListener('DOMContentLoaded', function () {
    const heroCarousel = document.querySelector('#heroCarousel');
    new bootstrap.Carousel(heroCarousel, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        touch: true
    });
});
