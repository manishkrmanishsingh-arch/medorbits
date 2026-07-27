const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

const form = document.getElementById("guidanceForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("studentName").value;
    const phone = document.getElementById("studentPhone").value;
    const course = document.getElementById("studentCourse").value;

    const message =
`Hello MedOrbit,

Name: ${name}
Phone: ${phone}
Course: ${course}

I need admission guidance.`;

    window.open(
        `https://wa.me/919142102309?text=${encodeURIComponent(message)}`,
        "_blank"
    );
});


/* ==========================================================
   AUTO BACKGROUND COLOR CHANGER
========================================================== */

const backgroundColors = [
  "linear-gradient(135deg, #f4f8ff 0%, #ffffff 100%)",
  "linear-gradient(135deg, #eef8ff 0%, #ffffff 100%)",
  "linear-gradient(135deg, #f6fff9 0%, #ffffff 100%)",
  "linear-gradient(135deg, #fff9f3 0%, #ffffff 100%)",
  "linear-gradient(135deg, #f9f5ff 0%, #ffffff 100%)",
  "linear-gradient(135deg, #fff7fb 0%, #ffffff 100%)"
];

let backgroundIndex = 0;

document.body.style.transition = "background 4s ease";

function changeWebsiteBackground() {

  backgroundIndex++;

  if (backgroundIndex >= backgroundColors.length) {
    backgroundIndex = 0;
  }

  document.body.style.background = backgroundColors[backgroundIndex];

}

setInterval(changeWebsiteBackground, 18000);


const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* ===========================
   MOBILE MENU CONTROL
=========================== */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {

  menuButton.addEventListener("click", function () {

    const isOpen = navLinks.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.textContent = isOpen ? "✕" : "☰";

  });


  navLinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      navLinks.classList.remove("active");

      menuButton.setAttribute("aria-expanded", "false");

      menuButton.textContent = "☰";

    });

  });


  document.addEventListener("click", function (event) {

    const clickedInsideMenu = navLinks.contains(event.target);

    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {

      navLinks.classList.remove("active");

      menuButton.setAttribute("aria-expanded", "false");

      menuButton.textContent = "☰";

    }

  });

}


