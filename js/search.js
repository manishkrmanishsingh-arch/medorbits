/* ==========================================================
   MedOrbit Search System
   File: js/search.js
   Works on Mobile, Tablet & Desktop
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.querySelector("#searchInput");

    const searchButton =
        document.querySelector("#searchButton");

    const searchResults =
        document.querySelector("#searchResults");

    const searchableItems =
        document.querySelectorAll(
            ".search-item, .card, .course-card, .program-card, .country-card"
        );

    if (!searchInput) return;

    function searchWebsite() {

        const keyword =
            searchInput.value.trim().toLowerCase();

        let found = 0;

        searchableItems.forEach(item => {

            const text =
                item.innerText.toLowerCase();

            if (keyword === "") {

                item.style.display = "";
                return;

            }

            if (text.includes(keyword)) {

                item.style.display = "";
                found++;

            } else {

                item.style.display = "none";

            }

        });

        if (searchResults) {

            if (keyword === "") {

                searchResults.innerHTML = "";

            } else if (found === 0) {

                searchResults.innerHTML =
                    "<p>No matching results found.</p>";

            } else {

                searchResults.innerHTML =
                    `<p>${found} result(s) found.</p>`;

            }

        }

    }

    searchInput.addEventListener("keyup", searchWebsite);

    if (searchButton) {

        searchButton.addEventListener("click", searchWebsite);

    }

    /* ===============================
       Search with Enter Key
    =============================== */

    searchInput.addEventListener("keypress", e => {

        if (e.key === "Enter") {

            e.preventDefault();

            searchWebsite();

        }

    });

    /* ===============================
       Clear Search
    =============================== */

    const clearButton =
        document.querySelector("#clearSearch");

    if (clearButton) {

        clearButton.addEventListener("click", () => {

            searchInput.value = "";

            searchableItems.forEach(item => {

                item.style.display = "";

            });

            if (searchResults) {

                searchResults.innerHTML = "";

            }

            searchInput.focus();

        });

    }

});