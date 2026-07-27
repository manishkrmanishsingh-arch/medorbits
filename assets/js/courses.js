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