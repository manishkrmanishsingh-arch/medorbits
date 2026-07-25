<script src="js/animations.js" defer></script>
/* =========================================================
   MedOrbit Smooth Animations
   File: js/animations.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     SETTINGS
     ========================================================= */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const supportsIntersectionObserver =
    "IntersectionObserver" in window;

  /* =========================================================
     SCROLL REVEAL ANIMATION
     ========================================================= */

  const animatedSelectors = [
    ".card",
    ".program-card",
    ".country-card",
    ".career-card",
    ".exam-card",
    ".step-box",
    ".hero-card",
    ".info-box",
    ".section-heading",
    ".why-grid",
    ".compare-wrap",
    ".page-card",
    ".form-section-card",
    ".form-selector",
    ".form-panel",
    ".education-box",
    ".education-side-card",
    ".job-card",
    ".job-category-card",
    ".job-service-card",
    ".job-employer-box"
  ].join(",");

  const animatedElements =
    document.querySelectorAll(animatedSelectors);

  if (reduceMotion || !supportsIntersectionObserver) {
    animatedElements.forEach((element) => {
      element.classList.add("animate-show");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    animatedElements.forEach((element, index) => {
      element.classList.add("animate-hidden");

      /*
       * Adds a small stagger only to nearby items.
       * Delay is limited so the page never feels slow.
       */
      element.style.setProperty(
        "--animation-delay",
        `${Math.min(index % 4, 3) * 70}ms`
      );

      revealObserver.observe(element);
    });
  }

  /* =========================================================
     COUNTER ANIMATION
     Usage:
     <span data-counter="500">0</span>
     <span data-counter="95" data-suffix="%">0</span>
     ========================================================= */

  const counters =
    document.querySelectorAll("[data-counter]");

  const formatCounter = (value, counter) => {
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";

    const formattedValue = new Intl.NumberFormat("en-IN").format(
      Math.floor(value)
    );

    return `${prefix}${formattedValue}${suffix}`;
  };

  const animateCounter = (counter) => {
    const target =
      Number.parseFloat(counter.dataset.counter) || 0;

    const duration =
      Number.parseInt(counter.dataset.duration, 10) || 1400;

    const startValue =
      Number.parseFloat(counter.dataset.start) || 0;

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /*
       * Ease-out animation
       */
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        startValue +
        (target - startValue) * easedProgress;

      counter.textContent =
        formatCounter(currentValue, counter);

      if (progress < 1) {
        window.requestAnimationFrame(updateCounter);
      } else {
        counter.textContent =
          formatCounter(target, counter);
      }
    };

    window.requestAnimationFrame(updateCounter);
  };

  counters.forEach((counter) => {
    if (reduceMotion || !supportsIntersectionObserver) {
      counter.textContent = formatCounter(
        Number(counter.dataset.counter) || 0,
        counter
      );

      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.45
      }
    );

    counterObserver.observe(counter);
  });

  /* =========================================================
     SMOOTH ANCHOR SCROLL
     ========================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");

        /*
         * Ignore empty links such as href="#"
         */
        if (!href || href === "#") return;

        let target;

        try {
          target = document.querySelector(href);
        } catch (error) {
          return;
        }

        if (!target) return;

        event.preventDefault();

        const header =
          document.querySelector(
            ".site-header, header"
          );

        const headerHeight =
          header?.offsetHeight || 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;

        window.scrollTo({
          top: targetPosition,
          behavior: reduceMotion ? "auto" : "smooth"
        });

        /*
         * Updates URL without jumping
         */
        if (history.pushState) {
          history.pushState(null, "", href);
        }
      });
    });

  /* =========================================================
     STICKY HEADER SHADOW
     ========================================================= */

  const header =
    document.querySelector(".site-header, header");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "header-scrolled",
      window.scrollY > 30
    );
  };

  updateHeader();

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */

  let scrollProgress =
    document.getElementById("scroll-progress");

  if (!scrollProgress) {
    scrollProgress =
      document.createElement("div");

    scrollProgress.id = "scroll-progress";
    scrollProgress.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.appendChild(scrollProgress);
  }

  const updateScrollProgress = () => {
    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const scrollPercentage =
      documentHeight > 0
        ? Math.min(
            Math.max(
              (window.scrollY / documentHeight) * 100,
              0
            ),
            100
          )
        : 0;

    scrollProgress.style.transform =
      `scaleX(${scrollPercentage / 100})`;
  };

  /* =========================================================
     BACK TO TOP BUTTON
     ========================================================= */

  let topButton =
    document.getElementById("backToTop");

  if (!topButton) {
    topButton =
      document.createElement("button");

    topButton.id = "backToTop";
    topButton.type = "button";
    topButton.innerHTML =
      '<span aria-hidden="true">↑</span>';

    topButton.setAttribute(
      "aria-label",
      "Back to top"
    );

    topButton.setAttribute(
      "title",
      "Back to top"
    );

    document.body.appendChild(topButton);
  }

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });

  const updateBackToTop = () => {
    topButton.classList.toggle(
      "show",
      window.scrollY > 450
    );
  };

  /* =========================================================
     OPTIMIZED SCROLL HANDLER
     Prevents excessive work on every scroll event
     ========================================================= */

  let scrollTicking = false;

  const handleScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateHeader();
      updateScrollProgress();
      updateBackToTop();

      scrollTicking = false;
    });
  };

  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );

  updateScrollProgress();
  updateBackToTop();

  /* =========================================================
     BUTTON RIPPLE EFFECT
     Supports multiple MedOrbit button classes
     ========================================================= */

  const rippleButtons =
    document.querySelectorAll(
      [
        ".btn",
        ".button",
        ".primary-button",
        ".secondary-button",
        ".submit-button",
        ".reset-button",
        ".job-search-button",
        ".job-apply-button",
        ".education-primary-button",
        ".education-secondary-button"
      ].join(",")
    );

  if (!reduceMotion) {
    rippleButtons.forEach((button) => {
      button.classList.add("ripple-container");

      button.addEventListener(
        "pointerdown",
        (event) => {
          /*
           * Do not run ripple for disabled buttons
           */
          if (button.disabled) return;

          const rect =
            button.getBoundingClientRect();

          const ripple =
            document.createElement("span");

          const size =
            Math.max(rect.width, rect.height) * 1.5;

          const clientX =
            event.clientX || rect.left + rect.width / 2;

          const clientY =
            event.clientY || rect.top + rect.height / 2;

          ripple.className = "ripple";

          ripple.style.width = `${size}px`;
          ripple.style.height = `${size}px`;

          ripple.style.left =
            `${clientX - rect.left - size / 2}px`;

          ripple.style.top =
            `${clientY - rect.top - size / 2}px`;

          /*
           * Remove previous ripple to avoid unnecessary DOM nodes
           */
          button
            .querySelectorAll(".ripple")
            .forEach((oldRipple) => {
              oldRipple.remove();
            });

          button.appendChild(ripple);

          ripple.addEventListener(
            "animationend",
            () => ripple.remove(),
            {
              once: true
            }
          );
        }
      );
    });
  }

  /* =========================================================
     CARD TILT EFFECT
     Only for desktop pointer devices
     Usage: add class="tilt-card"
     ========================================================= */

  const supportsHover =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

  if (supportsHover && !reduceMotion) {
    document
      .querySelectorAll(".tilt-card")
      .forEach((card) => {
        card.addEventListener(
          "pointermove",
          (event) => {
            const rect =
              card.getBoundingClientRect();

            const x =
              event.clientX - rect.left;

            const y =
              event.clientY - rect.top;

            const rotateX =
              ((y / rect.height) - 0.5) * -4;

            const rotateY =
              ((x / rect.width) - 0.5) * 4;

            card.style.transform =
              `perspective(900px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-3px)`;
          }
        );

        card.addEventListener(
          "pointerleave",
          () => {
            card.style.transform = "";
          }
        );
      });
  }

  /* =========================================================
     FILE UPLOAD DRAG STATE
     ========================================================= */

  document
    .querySelectorAll(".file-upload")
    .forEach((uploadArea) => {
      const input =
        uploadArea.querySelector(
          'input[type="file"]'
        );

      if (!input) return;

      ["dragenter", "dragover"].forEach(
        (eventName) => {
          uploadArea.addEventListener(
            eventName,
            (event) => {
              event.preventDefault();
              uploadArea.classList.add(
                "dragging"
              );
            }
          );
        }
      );

      ["dragleave", "drop"].forEach(
        (eventName) => {
          uploadArea.addEventListener(
            eventName,
            (event) => {
              event.preventDefault();
              uploadArea.classList.remove(
                "dragging"
              );
            }
          );
        }
      );
    });

  /* =========================================================
     FORM SUBMIT LOADING EFFECT
     Works with your forms.html buttons
     ========================================================= */

  document
    .querySelectorAll("form")
    .forEach((form) => {
      form.addEventListener(
        "submit",
        () => {
          const button =
            form.querySelector(
              [
                ".submit-button",
                ".advanced-submit-button",
                ".submit-btn"
              ].join(",")
            );

          if (!button || !form.checkValidity()) {
            return;
          }

          /*
           * Backend code can remove this class after response.
           * Existing form code may also control disabled state.
           */
          button.classList.add("is-loading");
        }
      );

      form.addEventListener(
        "reset",
        () => {
          const button =
            form.querySelector(
              [
                ".submit-button",
                ".advanced-submit-button",
                ".submit-btn"
              ].join(",")
            );

          button?.classList.remove("is-loading");
        }
      );
    });

  /* =========================================================
     PAGE LOADED STATE
     ========================================================= */

  document.body.classList.add("page-loaded");
});