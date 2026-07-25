"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initHeroSlider();

    initAdmissionSearch();

    initJobSearch();

    initFeaturedColleges();

    initFeaturedUniversities();

    initCountryCards();

    initCareerPrograms();

    initTestimonials();

    initRecruiters();

    initLatestJobs();

    initScholarships();

    initNews();

    initEvents();

    initFAQ();

    initNewsletter();

    initAnnouncementBar();

    initPopupBanner();

    initFloatingButtons();

    initHeroAnimation();

    initGreeting();

    initLiveVisitors();

    initScrollEffects();

    initLazyLoad();

});
function initHeroSlider(){

    const slides=document.querySelectorAll(".hero-slide");

    if(slides.length===0) return;

    let current=0;

    function show(index){

        slides.forEach(slide=>{

            slide.classList.remove("active");

        });

        slides[index].classList.add("active");

    }

    show(current);

    setInterval(()=>{

        current++;

        if(current>=slides.length){

            current=0;

        }

        show(current);

    },5000);

}
function initAdmissionSearch(){

const form=document.getElementById("admissionSearch");

if(!form) return;

form.addEventListener("submit",function(e){

e.preventDefault();

const course=this.course.value;
const country=this.country.value;

console.log(course,country);

});

}
function initJobSearch(){

const form=document.getElementById("jobSearch");

if(!form) return;

form.addEventListener("submit",function(e){

e.preventDefault();

const keyword=this.keyword.value;

console.log(keyword);

});

}
function initGreeting(){

const greeting=document.querySelector(".greeting");

if(!greeting) return;

const hour=new Date().getHours();

let text="Welcome";

if(hour<12){

text="Good Morning";

}else if(hour<17){

text="Good Afternoon";

}else{

text="Good Evening";

}

greeting.textContent=text;

}
function initFloatingButtons(){

const whatsapp=document.querySelector(".whatsapp-button");

if(!whatsapp) return;

whatsapp.onclick=()=>{

window.open(

"https://wa.me/919142102309",

"_blank"

);

};

}
function initLiveVisitors(){

const live=document.querySelector(".live-users");

if(!live) return;

setInterval(()=>{

live.textContent=

Math.floor(

Math.random()*40

)+120;

},5000);

}
function initScrollEffects(){

window.addEventListener("scroll",()=>{

document.body.classList.toggle(

"scrolled",

window.scrollY>150

);

});

}
function initLazyLoad(){

const images=document.querySelectorAll("img[data-src]");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.src=entry.target.dataset.src;

observer.unobserve(entry.target);

}

});

});

images.forEach(img=>observer.observe(img));

}


