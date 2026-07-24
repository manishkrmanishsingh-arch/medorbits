/* =====================================================
   MedOrbit Animations
   File: js/animations.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------
       Fade & Slide Animation
    -----------------------------------*/

    const animatedElements = document.querySelectorAll(
        ".card, .program-card, .country-card, .career-card, .exam-card, .step-box, .hero-card, .info-box, .section-heading, .why-grid, .compare-wrap"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("animate-show");

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.15

    });

    animatedElements.forEach(el => {

        el.classList.add("animate-hidden");

        observer.observe(el);

    });


    /* ----------------------------------
       Counter Animation
    -----------------------------------*/

    const counters = document.querySelectorAll("[data-counter]");

    counters.forEach(counter => {

        const updateCounter = () => {

            const target = +counter.dataset.counter;

            const current = +counter.innerText;

            const increment = Math.ceil(target / 100);

            if (current < target) {

                counter.innerText = current + increment;

                setTimeout(updateCounter, 18);

            } else {

                counter.innerText = target;

            }

        };

        const counterObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    updateCounter();

                    counterObserver.disconnect();

                }

            });

        });

        counterObserver.observe(counter);

    });


    /* ----------------------------------
       Smooth Scroll
    -----------------------------------*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        });

    });


    /* ----------------------------------
       Sticky Header Shadow
    -----------------------------------*/

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (!header) return;

        if (window.scrollY > 40) {

            header.classList.add("header-scrolled");

        } else {

            header.classList.remove("header-scrolled");

        }

    });


    /* ----------------------------------
       Button Ripple Effect
    -----------------------------------*/

    document.querySelectorAll(".btn").forEach(button => {

        button.addEventListener("click", function(e) {

            const ripple = document.createElement("span");

            ripple.className = "ripple";

            const rect = this.getBoundingClientRect();

            ripple.style.left = `${e.clientX - rect.left}px`;

            ripple.style.top = `${e.clientY - rect.top}px`;

            this.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 600);

        });

    });


    /* ----------------------------------
       Scroll Progress Bar
    -----------------------------------*/

    const progress = document.createElement("div");

    progress.id = "scroll-progress";

    document.body.appendChild(progress);

    window.addEventListener("scroll", () => {

        const totalHeight =

            document.documentElement.scrollHeight -

            window.innerHeight;

        const progressWidth =

            (window.pageYOffset / totalHeight) * 100;

        progress.style.width = progressWidth + "%";

    });


    /* ----------------------------------
       Back To Top Button
    -----------------------------------*/

    const topBtn = document.createElement("button");

    topBtn.id = "backToTop";

    topBtn.innerHTML = "↑";

    document.body.appendChild(topBtn);

    topBtn.onclick = () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            topBtn.classList.add("show");

        } else {

            topBtn.classList.remove("show");

        }

    });

});