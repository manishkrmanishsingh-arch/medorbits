/* ==========================================================
   MedOrbit Responsive Slider
   File: js/slider.js
   Works on Mobile, Tablet and Desktop
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const sliders = document.querySelectorAll(
        ".medorbit-slider, .slider, [data-slider]"
    );

    sliders.forEach(slider => {

        const track = slider.querySelector(
            ".slider-track, .slides, [data-slider-track]"
        );

        const slides = slider.querySelectorAll(
            ".slide, .slider-item, [data-slide]"
        );

        const previousButton = slider.querySelector(
            ".slider-prev, .prev-slide, [data-slider-prev]"
        );

        const nextButton = slider.querySelector(
            ".slider-next, .next-slide, [data-slider-next]"
        );

        const dotsContainer = slider.querySelector(
            ".slider-dots, [data-slider-dots]"
        );

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        const autoplayDelay =
            Number(slider.dataset.autoplayDelay) || 4500;

        const autoplayEnabled =
            slider.dataset.autoplay !== "false";

        function getSlidesPerView() {

            if (window.innerWidth <= 600) {
                return Number(slider.dataset.mobileSlides) || 1;
            }

            if (window.innerWidth <= 992) {
                return Number(slider.dataset.tabletSlides) || 2;
            }

            return Number(slider.dataset.desktopSlides) || 3;

        }

        function getMaximumIndex() {

            return Math.max(
                0,
                slides.length - getSlidesPerView()
            );

        }

        function updateSlideWidths() {

            const slidesPerView = getSlidesPerView();

            slides.forEach(slide => {

                slide.style.flex =
                    `0 0 ${100 / slidesPerView}%`;

                slide.style.maxWidth =
                    `${100 / slidesPerView}%`;

            });

        }

        function updateSlider() {

            const slidesPerView = getSlidesPerView();

            const movement =
                currentIndex * (100 / slidesPerView);

            track.style.transform =
                `translateX(-${movement}%)`;

            updateButtons();
            updateDots();

        }

        function updateButtons() {

            const maximumIndex = getMaximumIndex();

            if (previousButton) {

                previousButton.disabled =
                    currentIndex === 0;

                previousButton.setAttribute(
                    "aria-disabled",
                    String(currentIndex === 0)
                );

            }

            if (nextButton) {

                nextButton.disabled =
                    currentIndex >= maximumIndex;

                nextButton.setAttribute(
                    "aria-disabled",
                    String(currentIndex >= maximumIndex)
                );

            }

        }

        function createDots() {

            if (!dotsContainer) return;

            dotsContainer.innerHTML = "";

            const totalDots =
                getMaximumIndex() + 1;

            for (let index = 0; index < totalDots; index++) {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "slider-dot";
                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    currentIndex = index;

                    updateSlider();
                    restartAutoplay();

                });

                dotsContainer.appendChild(dot);

            }

        }

        function updateDots() {

            if (!dotsContainer) return;

            const dots =
                dotsContainer.querySelectorAll(".slider-dot");

            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

                dot.setAttribute(
                    "aria-current",
                    index === currentIndex
                        ? "true"
                        : "false"
                );

            });

        }

        function goToNextSlide() {

            const maximumIndex = getMaximumIndex();

            if (currentIndex >= maximumIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }

            updateSlider();

        }

        function goToPreviousSlide() {

            const maximumIndex = getMaximumIndex();

            if (currentIndex <= 0) {
                currentIndex = maximumIndex;
            } else {
                currentIndex--;
            }

            updateSlider();

        }

        function startAutoplay() {

            if (!autoplayEnabled) return;

            stopAutoplay();

            autoplayTimer = window.setInterval(
                goToNextSlide,
                autoplayDelay
            );

        }

        function stopAutoplay() {

            if (autoplayTimer) {

                clearInterval(autoplayTimer);

                autoplayTimer = null;

            }

        }

        function restartAutoplay() {

            stopAutoplay();
            startAutoplay();

        }

        if (previousButton) {

            previousButton.addEventListener("click", () => {

                goToPreviousSlide();
                restartAutoplay();

            });

        }

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                goToNextSlide();
                restartAutoplay();

            });

        }

        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", startAutoplay);

        slider.addEventListener("focusin", stopAutoplay);
        slider.addEventListener("focusout", startAutoplay);

        track.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );

        track.addEventListener(
            "touchend",
            event => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const swipeDistance =
                    touchStartX - touchEndX;

                if (Math.abs(swipeDistance) < 50) return;

                if (swipeDistance > 0) {
                    goToNextSlide();
                } else {
                    goToPreviousSlide();
                }

                restartAutoplay();

            },
            { passive: true }
        );

        window.addEventListener("resize", () => {

            updateSlideWidths();

            const maximumIndex = getMaximumIndex();

            if (currentIndex > maximumIndex) {
                currentIndex = maximumIndex;
            }

            createDots();
            updateSlider();

        });

        updateSlideWidths();
        createDots();
        updateSlider();
        startAutoplay();

    });

});