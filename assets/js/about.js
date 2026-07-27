const menuToggle=document.getElementById("menuToggle");

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

document.getElementById("year").textContent=
new Date().getFullYear();