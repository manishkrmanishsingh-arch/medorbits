/*==================================================
MEDORBIT COURSES PAGE
==================================================*/

document.addEventListener("DOMContentLoaded", function () {

  /*================================================
  ELEMENT REFERENCES
  ================================================*/

  const menuToggle =
    document.getElementById("menuToggle");

  const navLinks =
    document.getElementById("navLinks");

  const courseSearch =
    document.getElementById("courseSearch");

  const categoryFilter =
    document.getElementById("categoryFilter");

  const courseCards =
    Array.from(
      document.querySelectorAll(".course-card")
    );

  const emptyState =
    document.getElementById("emptyState");

  const yearElement =
    document.getElementById("year");


  /*================================================
  MOBILE NAVIGATION
  ================================================*/

  if (menuToggle && navLinks) {

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.addEventListener(
      "click",
      function () {

        const isOpen =
          navLinks.classList.toggle("active");

        document.body.classList.toggle(
          "menu-open",
          isOpen
        );

        menuToggle.textContent =
          isOpen ? "✕" : "☰";

        menuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

        menuToggle.setAttribute(
          "aria-label",
          isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        );

      }
    );

    navLinks
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          function () {

            closeMobileMenu();

          }
        );

      });

    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Escape") {
          closeMobileMenu();
        }

      }
    );

    window.addEventListener(
      "resize",
      function () {

        if (window.innerWidth > 1050) {
          closeMobileMenu();
        }

      }
    );

  }

  function closeMobileMenu() {

    if (!menuToggle || !navLinks) {
      return;
    }

    navLinks.classList.remove("active");

    document.body.classList.remove(
      "menu-open"
    );

    menuToggle.textContent = "☰";

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

  }


  /*================================================
  COURSE SEARCH AND CATEGORY FILTER
  ================================================*/

  function filterCourses() {

    const searchValue =
      courseSearch
        ? courseSearch.value
            .toLowerCase()
            .trim()
        : "";

    const selectedCategory =
      categoryFilter
        ? categoryFilter.value
        : "all";

    let visibleCount = 0;

    courseCards.forEach(function (card) {

      const searchableText = [
        card.dataset.name || "",
        card.dataset.category || "",
        card.textContent || ""
      ]
        .join(" ")
        .toLowerCase();

      const cardCategory =
        card.dataset.category || "";

      const matchesSearch =
        !searchValue ||
        searchableText.includes(searchValue);

      const matchesCategory =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      const shouldDisplay =
        matchesSearch && matchesCategory;

      card.hidden = !shouldDisplay;

      if (shouldDisplay) {
        visibleCount += 1;
      }

    });

    if (emptyState) {

      emptyState.style.display =
        visibleCount === 0
          ? "block"
          : "none";

    }

  }

  if (courseSearch) {

    courseSearch.addEventListener(
      "input",
      filterCourses
    );

  }

  if (categoryFilter) {

    categoryFilter.addEventListener(
      "change",
      filterCourses
    );

  }


  /*================================================
  QUICK CATEGORY SHORTCUTS
  ================================================*/

  document
    .querySelectorAll(".category-shortcut")
    .forEach(function (shortcut) {

      shortcut.addEventListener(
        "click",
        function (event) {

          const category =
            shortcut.dataset.category;

          if (!categoryFilter || !category) {
            return;
          }

          event.preventDefault();

          categoryFilter.value = category;

          if (courseSearch) {
            courseSearch.value = "";
          }

          filterCourses();

          const directory =
            document.getElementById(
              "all-courses"
            );

          if (directory) {

            directory.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });


  /*================================================
  OPTIONAL POPULAR SEARCH BUTTONS
  ================================================*/

  document
    .querySelectorAll(".search-suggestion")
    .forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const searchValue =
            button.dataset.search || "";

          if (courseSearch) {
            courseSearch.value = searchValue;
          }

          if (categoryFilter) {
            categoryFilter.value = "all";
          }

          filterCourses();

          const directory =
            document.getElementById(
              "all-courses"
            );

          if (directory) {

            directory.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });


  /*================================================
  SMOOTH INTERNAL LINKS
  ================================================*/

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (anchor) {

      anchor.addEventListener(
        "click",
        function (event) {

          const href =
            anchor.getAttribute("href");

          if (!href || href === "#") {
            return;
          }

          const target =
            document.querySelector(href);

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /*================================================
  SCROLL REVEAL
  ================================================*/

  const revealElements =
    document.querySelectorAll(`
      .section-heading,
      .quick-category,
      .course-card,
      .popular-card,
      .step-card,
      .search-panel,
      .cta-box
    `);

  if (
    "IntersectionObserver" in window &&
    revealElements.length
  ) {

    const revealObserver =
      new IntersectionObserver(
        function (entries, observer) {

          entries.forEach(function (entry) {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "reveal-active"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    revealElements.forEach(
      function (element) {

        element.classList.add(
          "reveal-item"
        );

        revealObserver.observe(element);

      }
    );

  } else {

    revealElements.forEach(
      function (element) {

        element.classList.add(
          "reveal-active"
        );

      }
    );

  }


  /*================================================
  IMAGE FALLBACK
  ================================================*/

  document
    .querySelectorAll(".course-image img")
    .forEach(function (image) {

      image.addEventListener(
        "error",
        function () {

          image.src =
            "assets/images/courses/default.jpg";

          image.alt =
            "MedOrbit course information";

        },
        {
          once: true
        }
      );

    });


  /*================================================
  CURRENT YEAR
  ================================================*/

  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  /*================================================
  INITIAL FILTER
  ================================================*/

  filterCourses();

});
>>>>>>>-HEAD
gle=document.getElementById("menuToggle");

const navLinks=document.getElementById("navLinks");

if(menuToggle){

menuToggle.onclick=function(){

navLinks.classList.toggle("active");

document.body.classList.toggle("menu-open");

menuToggle.innerHTML=
navLinks.classList.contains("active")
?"✕":"☰";

};

}

document.querySelectorAll(".nav-links a").forEach(link=>{

link.onclick=()=>{

navLinks.classList.remove("active");

document.body.classList.remove("menu-open");

menuToggle.innerHTML="☰";

};

});

const courseSearch=document.getElementById("courseSearch");

const categoryFilter=document.getElementById("categoryFilter");

const courseCards=document.querySelectorAll(".course-card");

const emptyState=document.getElementById("emptyState");

function filterCourses(){

const search=(courseSearch?.value||"").toLowerCase();

const category=categoryFilter?.value||"all";

let visible=0;

courseCards.forEach(card=>{

const name=(card.dataset.name||"").toLowerCase();

const type=card.dataset.category;

const okSearch=name.includes(search);

const okCategory=category==="all"||type===category;

if(okSearch&&okCategory){

card.style.display="flex";

visible++;

}else{

card.style.display="none";

}

});

if(emptyState){

emptyState.style.display=visible?"none":"block";

}

}

courseSearch?.addEventListener("input",filterCourses);

categoryFilter?.addEventListener("change",filterCourses);

document.querySelectorAll(".category-shortcut").forEach(item=>{

item.onclick=function(){

categoryFilter.value=this.dataset.category;

courseSearch.value="";

filterCourses();

};

});

document.getElementById("year").textContent=
new Date().getFullYear();
