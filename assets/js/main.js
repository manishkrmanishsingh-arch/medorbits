/* ==========================================================
   MedOrbit Main Controller
   File: js/main.js
========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    console.log("MedOrbit Initialized");

    initLoader();
    initHeader();
    initNavigation();
    initDropdowns();
    initBackToTop();
    initSearch();
    initTheme();
    initScrollSpy();
    initAccordions();
    initTabs();
    initCounters();
    initLazyImages();
    initForms();
    initTooltips();
    initCurrentYear();

});

/* ==========================================================
   Page Loader
========================================================== */

function initLoader(){

    const loader=document.querySelector(".page-loader");

    if(!loader) return;

    window.addEventListener("load",()=>{

        loader.classList.add("hide");

        setTimeout(()=>{

            loader.remove();

        },600);

    });

}

/* ==========================================================
   Sticky Header
========================================================== */

function initHeader(){

    const header=document.querySelector("header");

    if(!header) return;

    window.addEventListener("scroll",()=>{

        header.classList.toggle(

            "header-scrolled",

            window.scrollY>40

        );

    },{passive:true});

}

/* ==========================================================
   Mobile Navigation
========================================================== */

function initNavigation(){

    const menu=document.querySelector(".menu-toggle");
    const nav=document.querySelector(".navigation");

    if(!menu || !nav) return;

    menu.onclick=()=>{

        nav.classList.toggle("active");
        menu.classList.toggle("active");

    };

}

/* ==========================================================
   Dropdown Menu
========================================================== */

function initDropdowns(){

document.querySelectorAll(".dropdown").forEach(item=>{

item.addEventListener("mouseenter",()=>{

item.classList.add("open");

});

item.addEventListener("mouseleave",()=>{

item.classList.remove("open");

});

});

}

/* ==========================================================
   Back To Top
========================================================== */

function initBackToTop(){

const btn=document.getElementById("backToTop");

if(!btn) return;

btn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}

/* ==========================================================
   Search Box
========================================================== */

function initSearch(){

const input=document.querySelector(".search-input");

if(!input) return;

input.addEventListener("input",()=>{

console.log(

"Searching:",

input.value

);

});

}

/* ==========================================================
   Dark Theme
========================================================== */

function initTheme(){

const button=document.getElementById("themeToggle");

if(!button) return;

const saved=localStorage.getItem("theme");

if(saved==="dark"){

document.body.classList.add("dark");

}

button.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")

?"dark"

:"light"

);

};

}

/* ==========================================================
   Scroll Spy
========================================================== */

function initScrollSpy(){

const links=document.querySelectorAll("nav a");

const sections=document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=

section.offsetTop-120;

if(window.scrollY>=top){

current=section.id;

}

});

links.forEach(link=>{

link.classList.remove("active");

if(

link.getAttribute("href")==="#"+current

){

link.classList.add("active");

}

});

});

}

/* ==========================================================
   Accordion
========================================================== */

function initAccordions(){

document.querySelectorAll(".accordion-item").forEach(item=>{

const head=item.querySelector(".accordion-header");

if(!head) return;

head.onclick=()=>{

item.classList.toggle("open");

};

});

}

/* ==========================================================
   Tabs
========================================================== */

function initTabs(){

document.querySelectorAll(".tabs").forEach(tab=>{

const buttons=tab.querySelectorAll("[data-tab]");

const panels=tab.querySelectorAll(".tab-panel");

buttons.forEach(button=>{

button.onclick=()=>{

buttons.forEach(btn=>btn.classList.remove("active"));

panels.forEach(panel=>panel.classList.remove("active"));

button.classList.add("active");

tab.querySelector(

button.dataset.tab

).classList.add("active");

};

});

});

}

/* ==========================================================
   Counters
========================================================== */

function initCounters(){

document.querySelectorAll("[data-counter]").forEach(counter=>{

counter.innerText="0";

});

}

/* ==========================================================
   Lazy Images
========================================================== */

function initLazyImages(){

const images=document.querySelectorAll("img[data-src]");

if(images.length===0) return;

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img=entry.target;

img.src=img.dataset.src;

img.removeAttribute("data-src");

observer.unobserve(img);

}

});

});

images.forEach(img=>observer.observe(img));

}

/* ==========================================================
   Forms
========================================================== */

function initForms(){

document.querySelectorAll("form").forEach(form=>{

form.addEventListener("submit",()=>{

const btn=form.querySelector("button[type=submit]");

if(btn){

btn.disabled=true;

btn.classList.add("loading");

}

});

});

}

/* ==========================================================
   Tooltips
========================================================== */

function initTooltips(){

document.querySelectorAll("[data-tooltip]").forEach(el=>{

el.addEventListener("mouseenter",()=>{

const tip=document.createElement("div");

tip.className="tooltip";

tip.innerText=el.dataset.tooltip;

document.body.appendChild(tip);

const rect=el.getBoundingClientRect();

tip.style.left=rect.left+"px";
tip.style.top=(rect.top-35)+"px";

el.tooltip=tip;

});

el.addEventListener("mouseleave",()=>{

el.tooltip?.remove();

});

});

}

/* ==========================================================
   Footer Year
========================================================== */

function initCurrentYear(){

document.querySelectorAll(".year").forEach(el=>{

el.textContent=new Date().getFullYear();

});

}

/* ==========================================================
   Global Utilities
========================================================== */

window.MedOrbit={

version:"2.0.0",

scrollTop(){

window.scrollTo({

top:0,

behavior:"smooth"

});

},

loader(message){

console.log(message);

}

<script src="js/main.js" defer></script>
<script src="js/animations.js" defer></script>
<script src="js/slider.js" defer></script>
<script src="js/forms.js" defer></script>

};