/* ==========================================================
   MedOrbit Universal Search
   File: js/search.js
========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initUniversalSearch();

});

/* ==========================================================
   Search Engine
========================================================== */

function initUniversalSearch(){

const input=document.querySelector("#searchInput");
const results=document.querySelector("#searchResults");

if(!input || !results) return;

const pages=[

{
title:"Study MBBS in India",
url:"countries/india.html",
keywords:"india mbbs medical college admission"
},

{
title:"Study MBBS in Nepal",
url:"countries/nepal.html",
keywords:"nepal mbbs study abroad"
},

{
title:"Study MBBS in Russia",
url:"countries/russia.html",
keywords:"russia medical university"
},

{
title:"Study MBBS in Georgia",
url:"countries/georgia.html",
keywords:"georgia medical university"
},

{
title:"Study MBBS in Kazakhstan",
url:"countries/kazakhstan.html",
keywords:"kazakhstan medical"
},

{
title:"Study MBBS in Uzbekistan",
url:"countries/uzbekistan.html",
keywords:"uzbekistan medical university"
},

{
title:"Private Jobs",
url:"jobs.html",
keywords:"airport hospital company sales driver office housekeeping security delivery"
},

{
title:"Admission Form",
url:"forms.html",
keywords:"apply admission registration"
},

{
title:"Courses",
url:"courses.html",
keywords:"mbbs bds nursing pharmacy ayush"
},

{
title:"Colleges",
url:"colleges.html",
keywords:"medical colleges engineering colleges"
},

{
title:"Universities",
url:"universities.html",
keywords:"medical universities"
},

{
title:"Fee Structure",
url:"fee-structure.html",
keywords:"fees tuition hostel"
},

{
title:"Scholarships",
url:"scholarships.html",
keywords:"financial aid scholarship"
},

{
title:"Career Counselling",
url:"career-counselling.html",
keywords:"career guidance"
},

{
title:"Contact",
url:"contact.html",
keywords:"phone whatsapp email"
}

];

input.addEventListener("input",()=>{

const value=input.value.toLowerCase().trim();

results.innerHTML="";

if(value===""){

results.style.display="none";

return;

}

const matched=pages.filter(page=>{

return(

page.title.toLowerCase().includes(value) ||

page.keywords.includes(value)

);

});

if(matched.length===0){

results.innerHTML=`

<div class="search-empty">

No result found

</div>

`;

results.style.display="block";

return;

}

matched.forEach(page=>{

const item=document.createElement("a");

item.href=page.url;

item.className="search-item";

item.innerHTML=`

<strong>${page.title}</strong>

<small>${page.url}</small>

`;

results.appendChild(item);

});

results.style.display="block";

});

document.addEventListener("click",(e)=>{

if(

!results.contains(e.target) &&

e.target!==input

){

results.style.display="none";

}

});

}
<div class="search-box">

<input
id="searchInput"
type="search"
placeholder="Search colleges, jobs, courses..."
autocomplete="off">

<div id="searchResults"></div>

</div>
.search-box{

position:relative;
width:100%;
max-width:500px;

}

#searchInput{

width:100%;
padding:15px 20px;
border-radius:10px;
border:1px solid #ddd;
font-size:16px;

}

#searchResults{

display:none;

position:absolute;

top:100%;
left:0;
right:0;

background:#fff;

border-radius:12px;

box-shadow:0 15px 40px rgba(0,0,0,.15);

margin-top:8px;

overflow:hidden;

z-index:9999;

}

.search-item{

display:block;

padding:15px 20px;

text-decoration:none;

color:#333;

transition:.3s;

}

.search-item:hover{

background:#eef6ff;

}

.search-item strong{

display:block;

color:#0056b3;

}

.search-item small{

color:#777;

}

.search-empty{

padding:20px;

text-align:center;

color:#888;

}