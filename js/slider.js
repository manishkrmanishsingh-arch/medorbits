/* ==========================================================
   MedOrbit Universal Slider
   File: js/slider.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

document.querySelectorAll(".slider").forEach(slider => {

const track = slider.querySelector(".slider-track");
const slides = slider.querySelectorAll(".slide");
const prev = slider.querySelector(".slider-prev");
const next = slider.querySelector(".slider-next");
const dotsContainer = slider.querySelector(".slider-dots");

if(!track || slides.length===0) return;

let index=0;
let autoplay=true;
let interval=5000;
let startX=0;
let currentX=0;

slides.forEach((_,i)=>{

const dot=document.createElement("button");
dot.className="slider-dot";

if(i===0) dot.classList.add("active");

dot.onclick=()=>{

index=i;
update();

};

dotsContainer?.appendChild(dot);

});

const dots=dotsContainer?.querySelectorAll(".slider-dot");

function update(){

track.style.transform=`translateX(-${index*100}%)`;

dots?.forEach((dot,i)=>{

dot.classList.toggle("active",i===index);

});

}

function nextSlide(){

index++;

if(index>=slides.length){

index=0;

}

update();

}

function prevSlide(){

index--;

if(index<0){

index=slides.length-1;

}

update();

}

next?.addEventListener("click",nextSlide);
prev?.addEventListener("click",prevSlide);

let auto=setInterval(nextSlide,interval);

slider.addEventListener("mouseenter",()=>{

clearInterval(auto);

});

slider.addEventListener("mouseleave",()=>{

if(autoplay){

auto=setInterval(nextSlide,interval);

}

});

slider.addEventListener("touchstart",(e)=>{

startX=e.touches[0].clientX;

});

slider.addEventListener("touchmove",(e)=>{

currentX=e.touches[0].clientX;

});

slider.addEventListener("touchend",()=>{

if(startX-currentX>50){

nextSlide();

}

if(currentX-startX>50){

prevSlide();

}

});

window.addEventListener("keydown",(e)=>{

if(e.key==="ArrowRight"){

nextSlide();

}

if(e.key==="ArrowLeft"){

prevSlide();

}

<script src="js/slider.js" defer></script>

});

});

});
