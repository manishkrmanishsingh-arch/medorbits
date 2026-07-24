/* ==================================================
   MedOrbit Enquiry System
   File: js/enquiry.js
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "919142102309";

    document.querySelectorAll("form").forEach(form => {

        form.addEventListener("submit", function (e) {

            if (!this.classList.contains("whatsapp-form")) return;

            e.preventDefault();

            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            const getValue = (...ids) => {
                for (const id of ids) {
                    const field = this.querySelector("#" + id);
                    if (field && field.value.trim() !== "") {
                        return field.value.trim();
                    }
                }
                return "";
            };

            const name = getValue("name");
            const phone = getValue("phone");
            const course = getValue("course", "program", "destination");
            const details = getValue("details");

            const message =
`Hello MedOrbit,

I need admission guidance.

Name : ${name}
Mobile : ${phone}
Course : ${course}

Additional Details :
${details}`;

            const url =
                "https://wa.me/" +
                WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);

            window.open(url, "_blank");

        });

    });

});