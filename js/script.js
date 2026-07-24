/* ==========================================================
   MedOrbit General Website Script
   File: js/script.js
   Compatible with Mobile, Tablet and Desktop
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       FAQ Accordion
    =============================== */

    const faqItems = document.querySelectorAll(
        ".faq-item, .accordion-item"
    );

    faqItems.forEach(item => {

        const question = item.querySelector(
            ".faq-question, .accordion-header"
        );

        const answer = item.querySelector(
            ".faq-answer, .accordion-content"
        );

        if (!question || !answer) return;

        question.setAttribute("role", "button");
        question.setAttribute("tabindex", "0");
        question.setAttribute("aria-expanded", "false");

        const toggleFAQ = () => {

            const isOpen = item.classList.contains("active");

            faqItems.forEach(otherItem => {

                if (otherItem === item) return;

                otherItem.classList.remove("active");

                const otherQuestion = otherItem.querySelector(
                    ".faq-question, .accordion-header"
                );

                if (otherQuestion) {
                    otherQuestion.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

            item.classList.toggle("active", !isOpen);

            question.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        };

        question.addEventListener("click", toggleFAQ);

        question.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                toggleFAQ();
            }

        });

    });

    /* ===============================
       Read More Buttons
    =============================== */

    document.querySelectorAll("[data-read-more]").forEach(button => {

        button.addEventListener("click", () => {

            const targetSelector =
                button.getAttribute("data-read-more");

            if (!targetSelector) return;

            const target =
                document.querySelector(targetSelector);

            if (!target) return;

            const isOpen =
                target.classList.toggle("expanded");

            button.textContent =
                isOpen ? "Read Less" : "Read More";

            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    });

    /* ===============================
       Course Filter Buttons
    =============================== */

    const filterButtons =
        document.querySelectorAll("[data-filter]");

    const filterItems =
        document.querySelectorAll("[data-category]");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter =
                button.getAttribute("data-filter");

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            filterItems.forEach(item => {

                const category =
                    item.getAttribute("data-category");

                if (
                    filter === "all" ||
                    category === filter
                ) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }

            });

        });

    });

    /* ===============================
       Form Button Loading State
    =============================== */

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", () => {

            const button = form.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            if (!button) return;

            if (button.tagName === "BUTTON") {

                const originalText =
                    button.textContent;

                button.dataset.originalText =
                    originalText;

                button.textContent =
                    "Please wait...";

                button.disabled = true;

                setTimeout(() => {

                    button.textContent =
                        button.dataset.originalText ||
                        "Submit";

                    button.disabled = false;

                }, 1800);

            }

        });

    });

    /* ===============================
       Phone Number Validation
    =============================== */

    document.querySelectorAll(
        'input[type="tel"], input[name*="phone"], input[id*="phone"]'
    ).forEach(input => {

        input.setAttribute("inputmode", "numeric");

        input.addEventListener("input", () => {

            input.value =
                input.value.replace(/\D/g, "").slice(0, 10);

        });

        input.addEventListener("blur", () => {

            if (
                input.value.length > 0 &&
                input.value.length !== 10
            ) {
                input.setCustomValidity(
                    "Please enter a valid 10-digit mobile number."
                );
            } else {
                input.setCustomValidity("");
            }

        });

    });

    /* ===============================
       External Links
    =============================== */

    document.querySelectorAll(
        'a[href^="http"]'
    ).forEach(link => {

        const linkHost =
            new URL(link.href).hostname;

        if (linkHost !== window.location.hostname) {

            link.setAttribute("target", "_blank");
            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });

    /* ===============================
       Image Lazy Loading
    =============================== */

    document.querySelectorAll("img").forEach(image => {

        if (!image.hasAttribute("loading")) {
            image.setAttribute("loading", "lazy");
        }

        image.addEventListener("error", () => {

            image.classList.add("image-error");

        });

    });

    /* ===============================
       Reveal Elements on Scroll
    =============================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            }, {
                threshold: 0.12
            });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

    /* ===============================
       Prevent Duplicate Form Submission
    =============================== */

    document.querySelectorAll("form").forEach(form => {

        let submitted = false;

        form.addEventListener("submit", event => {

            if (submitted) {
                event.preventDefault();
                return;
            }

            if (form.checkValidity()) {

                submitted = true;

                setTimeout(() => {
                    submitted = false;
                }, 2500);

            }

        });

    });

    /* ===============================
       Close Notification Messages
    =============================== */

    document.querySelectorAll(
        ".alert, .notification, .message-box"
    ).forEach(message => {

        const closeButton =
            message.querySelector(
                ".close-alert, .close-notification, .close-message"
            );

        if (!closeButton) return;

        closeButton.addEventListener("click", () => {

            message.style.display = "none";

        });

    });

});