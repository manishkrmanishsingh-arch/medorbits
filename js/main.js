/* ==========================================================
   MedOrbit Main JavaScript
   File: js/main.js
   Responsive for Mobile, Tablet and Desktop
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector("#menuToggle, .menu-toggle");
    const mainNav = document.querySelector("#mainNav, header nav");
    const header = document.querySelector("header");

    /* ===============================
       Mobile Navigation
    =============================== */

    const closeMenu = () => {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove("active");
        document.body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = "☰";
    };

    if (menuToggle && mainNav) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen = mainNav.classList.toggle("active");

            document.body.classList.toggle("nav-open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.innerHTML = isOpen ? "✕" : "☰";

        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                if (window.innerWidth <= 900) {
                    closeMenu();
                }

            });

        });

        document.addEventListener("click", (event) => {

            const clickedInsideNav = mainNav.contains(event.target);
            const clickedMenuButton = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedMenuButton) {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                closeMenu();
            }

        });

    }

    /* ===============================
       Sticky Header
    =============================== */

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 30) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }

    };

    window.addEventListener("scroll", updateHeader, { passive: true });

    updateHeader();

    /* ===============================
       Smooth Scrolling
    =============================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const href = this.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                12;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });

    /* ===============================
       Active Navigation Link
    =============================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("header nav a").forEach(link => {

        const href = link.getAttribute("href");

        if (!href) return;

        const pageLink = href.split("#")[0];

        if (pageLink === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

    });

    /* ===============================
       Current Copyright Year
    =============================== */

    document.querySelectorAll("#year, [data-current-year]").forEach(element => {

        element.textContent = new Date().getFullYear();

    });

    /* ===============================
       Back To Top Button
    =============================== */

    let backToTop = document.querySelector("#backToTop");

    if (!backToTop) {

        backToTop = document.createElement("button");

        backToTop.id = "backToTop";
        backToTop.type = "button";
        backToTop.innerHTML = "↑";
        backToTop.setAttribute("aria-label", "Back to top");

        document.body.appendChild(backToTop);

    }

    const updateBackToTop = () => {

        if (window.scrollY > 500) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    };

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    window.addEventListener("scroll", updateBackToTop, { passive: true });

    updateBackToTop();

    /* ===============================
       Prevent Empty Links
    =============================== */

    document.querySelectorAll('a[href="#"]').forEach(link => {

        link.addEventListener("click", event => {
            event.preventDefault();
        });

    });

});