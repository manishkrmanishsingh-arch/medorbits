/* =========================================================
   MedOrbit Website Utilities
   File: js/script.js

   Handles:
   - Mobile navigation
   - Dropdown menus
   - Search overlay
   - Accordion and FAQ
   - Tabs
   - Modal windows
   - Form validation
   - File-name preview
   - Password visibility
   - Character counters
   - Copy buttons
   - WhatsApp links
   - Active navigation
   - Cookie notice
   - Network status
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initDropdownMenus();
  initSearchOverlay();
  initAccordions();
  initTabs();
  initModals();
  initFormValidation();
  initFileUploads();
  initPasswordToggles();
  initCharacterCounters();
  initCopyButtons();
  initWhatsAppButtons();
  initActiveNavigation();
  initCookieNotice();
  initNetworkStatus();
  initExternalLinks();
  initCurrentYear();
});

/* =========================================================
   Mobile navigation
   ========================================================= */

function initMobileNavigation() {
  const menuButton = document.querySelector(
    "#menuButton, .menu-button, .menu-toggle"
  );

  const navigation = document.querySelector(
    "#headerNavigation, #mainNavigation, .header-nav, .navigation"
  );

  if (!menuButton || !navigation) return;

  const closeNavigation = () => {
    navigation.classList.remove("open", "active");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", () => {
    const isOpen =
      navigation.classList.toggle("open");

    navigation.classList.toggle("active", isOpen);
    menuButton.classList.toggle("active", isOpen);

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );
  });

  navigation
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeNavigation();
    }
  });
}

/* =========================================================
   Dropdown menus
   HTML:
   <li class="dropdown">
     <button class="dropdown-toggle">Courses</button>
     <div class="dropdown-menu">...</div>
   </li>
   ========================================================= */

function initDropdownMenus() {
  document
    .querySelectorAll(".dropdown")
    .forEach((dropdown) => {
      const toggle =
        dropdown.querySelector(".dropdown-toggle");

      const menu =
        dropdown.querySelector(".dropdown-menu");

      if (!toggle || !menu) return;

      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        document
          .querySelectorAll(".dropdown.open")
          .forEach((openDropdown) => {
            if (openDropdown !== dropdown) {
              openDropdown.classList.remove("open");

              openDropdown
                .querySelector(".dropdown-toggle")
                ?.setAttribute(
                  "aria-expanded",
                  "false"
                );
            }
          });

        const isOpen =
          dropdown.classList.toggle("open");

        toggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      });

      dropdown.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Escape") {
            dropdown.classList.remove("open");
            toggle.setAttribute(
              "aria-expanded",
              "false"
            );
            toggle.focus();
          }
        }
      );
    });

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown.open")
      .forEach((dropdown) => {
        dropdown.classList.remove("open");

        dropdown
          .querySelector(".dropdown-toggle")
          ?.setAttribute(
            "aria-expanded",
            "false"
          );
      });
  });
}

/* =========================================================
   Search overlay
   Required IDs:
   #searchOpen
   #searchClose
   #searchOverlay
   #siteSearchInput
   ========================================================= */

function initSearchOverlay() {
  const openButton =
    document.getElementById("searchOpen");

  const closeButton =
    document.getElementById("searchClose");

  const overlay =
    document.getElementById("searchOverlay");

  const input =
    document.getElementById("siteSearchInput");

  if (!overlay) return;

  const openSearch = () => {
    overlay.classList.add("active");
    document.body.classList.add("search-open");

    window.setTimeout(() => {
      input?.focus();
    }, 100);
  };

  const closeSearch = () => {
    overlay.classList.remove("active");
    document.body.classList.remove("search-open");
  };

  openButton?.addEventListener(
    "click",
    openSearch
  );

  closeButton?.addEventListener(
    "click",
    closeSearch
  );

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      overlay.classList.contains("active")
    ) {
      closeSearch();
    }
  });
}

/* =========================================================
   Accordion and FAQ
   ========================================================= */

function initAccordions() {
  document
    .querySelectorAll(
      ".accordion-item, .faq-item"
    )
    .forEach((item) => {
      const trigger =
        item.querySelector(
          ".accordion-header, .faq-question"
        );

      const content =
        item.querySelector(
          ".accordion-content, .faq-answer"
        );

      if (!trigger || !content) return;

      trigger.setAttribute(
        "aria-expanded",
        "false"
      );

      content.hidden = true;

      trigger.addEventListener("click", () => {
        const parent =
          item.parentElement;

        const isOpen =
          item.classList.contains("open");

        if (
          parent?.dataset.singleOpen === "true"
        ) {
          parent
            .querySelectorAll(
              ".accordion-item.open, .faq-item.open"
            )
            .forEach((openItem) => {
              if (openItem === item) return;

              openItem.classList.remove("open");

              openItem
                .querySelector(
                  ".accordion-header, .faq-question"
                )
                ?.setAttribute(
                  "aria-expanded",
                  "false"
                );

              const openContent =
                openItem.querySelector(
                  ".accordion-content, .faq-answer"
                );

              if (openContent) {
                openContent.hidden = true;
              }
            });
        }

        item.classList.toggle("open", !isOpen);

        trigger.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

        content.hidden = isOpen;
      });
    });
}

/* =========================================================
   Tabs
   HTML:
   <div class="tabs">
     <button data-tab-target="panel-one">Tab</button>
     <div id="panel-one" class="tab-panel"></div>
   </div>
   ========================================================= */

function initTabs() {
  document
    .querySelectorAll(".tabs")
    .forEach((tabs) => {
      const buttons =
        tabs.querySelectorAll(
          "[data-tab-target]"
        );

      const panels =
        tabs.querySelectorAll(".tab-panel");

      if (!buttons.length || !panels.length) {
        return;
      }

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId =
            button.dataset.tabTarget;

          const targetPanel =
            tabs.querySelector(
              `#${CSS.escape(targetId)}`
            );

          if (!targetPanel) return;

          buttons.forEach((item) => {
            const active =
              item === button;

            item.classList.toggle(
              "active",
              active
            );

            item.setAttribute(
              "aria-selected",
              String(active)
            );
          });

          panels.forEach((panel) => {
            const active =
              panel === targetPanel;

            panel.classList.toggle(
              "active",
              active
            );

            panel.hidden = !active;
          });
        });
      });
    });
}

/* =========================================================
   Modal windows
   Open:
   data-modal-open="applicationModal"

   Close:
   data-modal-close="applicationModal"
   ========================================================= */

function initModals() {
  const openModal = (modal) => {
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    modal
      .querySelector(
        "input, select, textarea, button"
      )
      ?.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document
    .querySelectorAll("[data-modal-open]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const id =
          button.dataset.modalOpen;

        openModal(
          document.getElementById(id)
        );
      });
    });

  document
    .querySelectorAll("[data-modal-close]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const id =
          button.dataset.modalClose;

        closeModal(
          document.getElementById(id)
        );
      });
    });

  document
    .querySelectorAll(".modal")
    .forEach((modal) => {
      modal.setAttribute(
        "aria-hidden",
        "true"
      );

      modal.addEventListener(
        "click",
        (event) => {
          if (event.target === modal) {
            closeModal(modal);
          }
        }
      );
    });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document
      .querySelectorAll(".modal.active")
      .forEach(closeModal);
  });
}

/* =========================================================
   Form validation
   ========================================================= */

function initFormValidation() {
  document
    .querySelectorAll(
      "form[data-validate], .medorbit-form"
    )
    .forEach((form) => {
      const fields =
        form.querySelectorAll(
          "input, select, textarea"
        );

      fields.forEach((field) => {
        field.addEventListener(
          "blur",
          () => validateField(field)
        );

        field.addEventListener(
          "input",
          () => {
            if (
              field.classList.contains("invalid")
            ) {
              validateField(field);
            }
          }
        );
      });

      form.addEventListener(
        "submit",
        (event) => {
          let valid = true;

          fields.forEach((field) => {
            if (!validateField(field)) {
              valid = false;
            }
          });

          if (!valid) {
            event.preventDefault();

            const firstInvalid =
              form.querySelector(".invalid");

            firstInvalid?.focus();

            showToast(
              "Please complete the required fields.",
              "error"
            );
          }
        }
      );
    });
}

function validateField(field) {
  if (
    field.disabled ||
    field.type === "hidden"
  ) {
    return true;
  }

  const valid = field.checkValidity();

  field.classList.toggle("invalid", !valid);
  field.classList.toggle(
    "valid",
    valid && field.value !== ""
  );

  const group =
    field.closest(".form-group");

  let error =
    group?.querySelector(".field-error");

  if (!valid && group) {
    if (!error) {
      error =
        document.createElement("small");

      error.className = "field-error";
      group.appendChild(error);
    }

    error.textContent =
      getValidationMessage(field);
  } else {
    error?.remove();
  }

  return valid;
}

function getValidationMessage(field) {
  if (field.validity.valueMissing) {
    return "This field is required.";
  }

  if (field.validity.typeMismatch) {
    if (field.type === "email") {
      return "Enter a valid email address.";
    }

    if (field.type === "url") {
      return "Enter a valid website address.";
    }
  }

  if (field.validity.patternMismatch) {
    return (
      field.dataset.patternMessage ||
      "Enter the information in the required format."
    );
  }

  if (field.validity.tooShort) {
    return `Enter at least ${field.minLength} characters.`;
  }

  if (field.validity.tooLong) {
    return `Maximum ${field.maxLength} characters allowed.`;
  }

  if (field.validity.rangeUnderflow) {
    return `Minimum value is ${field.min}.`;
  }

  if (field.validity.rangeOverflow) {
    return `Maximum value is ${field.max}.`;
  }

  return "Please check this field.";
}

/* =========================================================
   File uploads
   ========================================================= */

function initFileUploads() {
  document
    .querySelectorAll(
      '.file-upload input[type="file"], input[data-file-preview]'
    )
    .forEach((input) => {
      input.addEventListener("change", () => {
        const container =
          input.closest(".file-upload") ||
          input.parentElement;

        const output =
          container?.querySelector(
            ".selected-files, .selected-file-name"
          );

        if (!output) return;

        if (!input.files?.length) {
          output.textContent = "";
          return;
        }

        const maxSizeMb =
          Number(input.dataset.maxSizeMb) || 10;

        const allowedFiles =
          Array.from(input.files).filter(
            (file) => {
              const valid =
                file.size <=
                maxSizeMb * 1024 * 1024;

              if (!valid) {
                showToast(
                  `${file.name} exceeds ${maxSizeMb} MB.`,
                  "error"
                );
              }

              return valid;
            }
          );

        output.textContent = allowedFiles.length
          ? `Selected: ${allowedFiles
              .map((file) => file.name)
              .join(", ")}`
          : "";
      });
    });
}

/* =========================================================
   Password visibility
   Button:
   data-password-toggle="passwordInput"
   ========================================================= */

function initPasswordToggles() {
  document
    .querySelectorAll(
      "[data-password-toggle]"
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        const input =
          document.getElementById(
            button.dataset.passwordToggle
          );

        if (!input) return;

        const showing =
          input.type === "text";

        input.type =
          showing ? "password" : "text";

        button.setAttribute(
          "aria-label",
          showing
            ? "Show password"
            : "Hide password"
        );

        button.classList.toggle(
          "showing",
          !showing
        );
      });
    });
}

/* =========================================================
   Character counters
   HTML:
   <textarea maxlength="500" data-character-count></textarea>
   ========================================================= */

function initCharacterCounters() {
  document
    .querySelectorAll(
      "[data-character-count]"
    )
    .forEach((field) => {
      const maximum =
        Number(field.maxLength);

      if (!maximum || maximum < 1) return;

      const counter =
        document.createElement("small");

      counter.className =
        "character-counter";

      field.insertAdjacentElement(
        "afterend",
        counter
      );

      const update = () => {
        const used =
          field.value.length;

        counter.textContent =
          `${used}/${maximum}`;

        counter.classList.toggle(
          "near-limit",
          used >= maximum * 0.9
        );
      };

      field.addEventListener("input", update);
      update();
    });
}

/* =========================================================
   Copy buttons
   HTML:
   <button data-copy-text="9142102309">Copy</button>
   ========================================================= */

function initCopyButtons() {
  document
    .querySelectorAll("[data-copy-text]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const text =
          button.dataset.copyText;

        try {
          await navigator.clipboard.writeText(
            text
          );

          showToast(
            "Copied successfully.",
            "success"
          );
        } catch {
          fallbackCopy(text);
        }
      });
    });
}

function fallbackCopy(text) {
  const textarea =
    document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();

  document.execCommand("copy");
  textarea.remove();

  showToast(
    "Copied successfully.",
    "success"
  );
}

/* =========================================================
   WhatsApp buttons
   HTML:
   <button
     data-whatsapp-number="919142102309"
     data-whatsapp-message="Hello MedOrbit">
   </button>
   ========================================================= */

function initWhatsAppButtons() {
  document
    .querySelectorAll(
      "[data-whatsapp-number]"
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        const number =
          button.dataset.whatsappNumber
            .replace(/\D/g, "");

        const message =
          button.dataset.whatsappMessage ||
          "Hello MedOrbit, I need assistance.";

        const url =
          `https://wa.me/${number}` +
          `?text=${encodeURIComponent(message)}`;

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });
}

/* =========================================================
   Active navigation
   ========================================================= */

function initActiveNavigation() {
  const currentPage =
    window.location.pathname
      .split("/")
      .pop() || "index.html";

  document
    .querySelectorAll(
      ".header-nav a, nav a"
    )
    .forEach((link) => {
      const href =
        link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http")
      ) {
        return;
      }

      const linkPage =
        href.split("?")[0].split("#")[0];

      link.classList.toggle(
        "active",
        linkPage === currentPage
      );
    });
}

/* =========================================================
   Cookie notice
   Required element:
   #cookieNotice
   ========================================================= */

function initCookieNotice() {
  const notice =
    document.getElementById("cookieNotice");

  if (!notice) return;

  const accepted =
    localStorage.getItem(
      "medorbit-cookie-consent"
    );

  if (accepted === "accepted") {
    notice.remove();
    return;
  }

  notice.classList.add("show");

  notice
    .querySelector("[data-cookie-accept]")
    ?.addEventListener("click", () => {
      localStorage.setItem(
        "medorbit-cookie-consent",
        "accepted"
      );

      notice.classList.remove("show");

      window.setTimeout(
        () => notice.remove(),
        250
      );
    });
}

/* =========================================================
   Online and offline status
   ========================================================= */

function initNetworkStatus() {
  const updateStatus = () => {
    if (navigator.onLine) {
      document.body.classList.remove(
        "is-offline"
      );

      document
        .getElementById("networkNotice")
        ?.remove();

      return;
    }

    document.body.classList.add(
      "is-offline"
    );

    if (
      document.getElementById("networkNotice")
    ) {
      return;
    }

    const notice =
      document.createElement("div");

    notice.id = "networkNotice";
    notice.className = "network-notice";
    notice.textContent =
      "You are offline. Some features may not work.";

    document.body.appendChild(notice);
  };

  window.addEventListener(
    "online",
    updateStatus
  );

  window.addEventListener(
    "offline",
    updateStatus
  );

  updateStatus();
}

/* =========================================================
   External links
   ========================================================= */

function initExternalLinks() {
  document
    .querySelectorAll('a[href^="http"]')
    .forEach((link) => {
      try {
        const url =
          new URL(link.href);

        if (
          url.hostname !==
          window.location.hostname
        ) {
          link.target = "_blank";
          link.rel =
            "noopener noreferrer";
        }
      } catch {
        // Ignore invalid links.
      }
    });
}

/* =========================================================
   Current year
   ========================================================= */

function initCurrentYear() {
  document
    .querySelectorAll(
      ".year, [data-current-year]"
    )
    .forEach((element) => {
      element.textContent =
        new Date().getFullYear();
    });
}

/* =========================================================
   Toast notification
   ========================================================= */

function showToast(
  message,
  type = "info",
  duration = 3500
) {
  let container =
    document.getElementById(
      "toastContainer"
    );

  if (!container) {
    container =
      document.createElement("div");

    container.id = "toastContainer";
    container.className =
      "toast-container";

    container.setAttribute(
      "aria-live",
      "polite"
    );

    document.body.appendChild(container);
  }

  const toast =
    document.createElement("div");

  toast.className =
    `site-toast ${type}`;

  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  window.setTimeout(() => {
    toast.classList.remove("show");

    toast.addEventListener(
      "transitionend",
      () => toast.remove(),
      {
        once: true
      }
    );
  }, duration);
}

/* =========================================================
   Global MedOrbit utilities
   ========================================================= */

window.MedOrbit = {
  ...(window.MedOrbit || {}),

  showToast,

  openModal(id) {
    const modal =
      document.getElementById(id);

    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute(
      "aria-hidden",
      "false"
    );
  },

  closeModal(id) {
    const modal =
      document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute(
      "aria-hidden",
      "true"
    );
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(amount);
  }
};