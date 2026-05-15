'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const heart = document.querySelector(".heart");
    if (heart) {
        const halo = document.createElement('div');
        halo.classList.add('halo');
        heart.appendChild(halo);
    }

    const navbar = document.getElementById("myTopnav");
    if (navbar) {
        const sticky = navbar.offsetTop;

        const handleScroll = () => {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky");
            } else {
                navbar.classList.remove("sticky");
            }
        };

        window.addEventListener("scroll", handleScroll);
    }
});