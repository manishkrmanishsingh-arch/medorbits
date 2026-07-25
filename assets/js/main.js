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