/* ==========================================
   MedOrbit Home JS
   File: js/home.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Hero Animation */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.classList.add("hero-loaded");

    }


    /* Active Navigation */

    const currentPage =
        window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });


    /* Hero Buttons Animation */

    const buttons =
        document.querySelectorAll(".hero .btn");

    buttons.forEach((button, index) => {

        button.style.animationDelay =
            (index * 0.2) + "s";

        button.classList.add("fade-up");

    });


    /* Floating Cards */

    const cards =
        document.querySelectorAll(".hero-card");

    cards.forEach((card, index) => {

        card.style.animationDelay =
            (index * 0.3) + "s";

        card.classList.add("float-card");

    });


    /* Scroll Down Button */

    const scrollBtn =
        document.querySelector(".scroll-down");

    if (scrollBtn) {

        scrollBtn.addEventListener("click", () => {

            window.scrollTo({

                top: window.innerHeight,

                behavior: "smooth"

            });

        });

    }


    /* Welcome Text */

    const title =
        document.querySelector(".hero h1");

    if (title) {

        title.classList.add("text-visible");

    }

});