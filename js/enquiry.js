/* ==========================================
   MedOrbit Enquiry JS
   File: js/enquiry.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", function (e) {

            if (!form.classList.contains("whatsapp-form")) return;

            e.preventDefault();

            const name =
                form.querySelector("#name")?.value || "";

            const phone =
                form.querySelector("#phone")?.value || "";

            const course =
                form.querySelector("#course")?.value ||
                form.querySelector("#program")?.value ||
                form.querySelector("#destination")?.value ||
                "";

            const details =
                form.querySelector("#details")?.value || "";

            const message =
`Hello MedOrbit,

I want admission guidance.

Name: ${name}
Phone: ${phone}
Course: ${course}

Details:
${details}`;

            const whatsapp =
                "https://wa.me/919142102309?text=" +
                encodeURIComponent(message);

            window.open(whatsapp, "_blank");

        });

    });

});