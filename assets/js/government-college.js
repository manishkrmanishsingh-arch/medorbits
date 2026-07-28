/*==================================================
  MEDORBIT GOVERNMENT COLLEGE PAGE
  File: assets/js/government-college.js
==================================================*/

"use strict";


/*==================================================
  JSON FILE LOCATION
==================================================*/

const GOVERNMENT_COLLEGE_DATA_URL =
  "../assets/data/government-medical.json";


/*==================================================
  PAGE SETTINGS
==================================================*/

const COLLEGES_PER_PAGE = 9;


/*==================================================
  PAGE ELEMENTS
==================================================*/

const menuButton =
  document.getElementById("menuButton");

const mainNavigation =
  document.getElementById("mainNavigation");

const collegeSearch =
  document.getElementById("collegeSearch");

const stateFilter =
  document.getElementById("stateFilter");

const courseFilter =
  document.getElementById("courseFilter");

const feeFilter =
  document.getElementById("feeFilter");

const sortFilter =
  document.getElementById("sortFilter");

const resetFiltersButton =
  document.getElementById("resetFiltersButton");

const clearSearchButton =
  document.getElementById("clearSearchButton");

const gridViewButton =
  document.getElementById("gridViewButton");

const listViewButton =
  document.getElementById("listViewButton");

const loadingState =
  document.getElementById("loadingState");

const errorState =
  document.getElementById("errorState");

const errorMessage =
  document.getElementById("errorMessage");

const emptyState =
  document.getElementById("emptyState");

const retryButton =
  document.getElementById("retryButton");

const collegeGrid =
  document.getElementById("collegeGrid");

const loadMoreWrapper =
  document.getElementById("loadMoreWrapper");

const loadMoreButton =
  document.getElementById("loadMoreButton");

const visibleCollegeCount =
  document.getElementById("visibleCollegeCount");

const totalCollegeCount =
  document.getElementById("totalCollegeCount");

const totalStateCount =
  document.getElementById("totalStateCount");

const totalCourseCount =
  document.getElementById("totalCourseCount");

const currentYear =
  document.getElementById("currentYear");


/*==================================================
  APPLICATION DATA
==================================================*/

let allColleges = [];
let filteredColleges = [];
let visibleLimit = COLLEGES_PER_PAGE;


/*==================================================
  MOBILE MENU
==================================================*/

if (menuButton && mainNavigation) {

  menuButton.addEventListener("click", function () {

    const isOpen =
      mainNavigation.classList.toggle("open");

    menuButton.classList.toggle("active", isOpen);

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  mainNavigation
    .querySelectorAll("a")
    .forEach(function (link) {

      link.addEventListener("click", function () {

        mainNavigation.classList.remove("open");
        menuButton.classList.remove("active");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });


  document.addEventListener("click", function (event) {

    const clickedInsideNavigation =
      mainNavigation.contains(event.target);

    const clickedMenuButton =
      menuButton.contains(event.target);

    if (
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {

      mainNavigation.classList.remove("open");
      menuButton.classList.remove("active");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

}


/*==================================================
  CURRENT YEAR
==================================================*/

if (currentYear) {
  currentYear.textContent =
    new Date().getFullYear();
}


/*==================================================
  SAFE VALUE HELPERS
==================================================*/

function getFirstValue(object, keys, fallback = "") {

  for (const key of keys) {

    const value = object?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }

  }

  return fallback;

}


function toSafeString(value) {

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value).trim();

}


function escapeHTML(value) {

  return toSafeString(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/*==================================================
  NUMBER HELPERS
==================================================*/

function extractNumber(value) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleanedValue =
    String(value)
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

  const parsedValue =
    Number.parseFloat(cleanedValue);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : 0;

}


function formatIndianNumber(value) {

  const numericValue =
    extractNumber(value);

  if (!numericValue) {
    return "Not available";
  }

  return new Intl.NumberFormat(
    "en-IN"
  ).format(numericValue);

}


function formatCurrency(value) {

  const numericValue =
    extractNumber(value);

  if (!numericValue) {
    return "Not available";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(numericValue);

}


/*==================================================
  ARRAY HELPERS
==================================================*/

function normaliseArray(value) {

  if (Array.isArray(value)) {

    return value
      .map(function (item) {

        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return toSafeString(item);
        }

        if (
          item &&
          typeof item === "object"
        ) {

          return toSafeString(
            getFirstValue(
              item,
              [
                "name",
                "course",
                "title",
                "value"
              ]
            )
          );

        }

        return "";

      })
      .filter(Boolean);

  }

  if (typeof value === "string") {

    return value
      .split(/[,|;/]+/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);

  }

  return [];

}


/*==================================================
  NORMALISE EACH COLLEGE
==================================================*/

function normaliseCollege(college, index) {

  const collegeName =
    toSafeString(
      getFirstValue(
        college,
        [
          "name",
          "collegeName",
          "college_name",
          "instituteName",
          "institute_name",
          "institution",
          "college"
        ],
        `Government Medical College ${index + 1}`
      )
    );


  const city =
    toSafeString(
      getFirstValue(
        college,
        [
          "city",
          "district",
          "locationCity",
          "location_city"
        ]
      )
    );


  const state =
    toSafeString(
      getFirstValue(
        college,
        [
          "state",
          "stateName",
          "state_name",
          "region"
        ]
      )
    );


  const university =
    toSafeString(
      getFirstValue(
        college,
        [
          "university",
          "affiliatedUniversity",
          "affiliated_university",
          "affiliation"
        ],
        "University information not available"
      )
    );


  const courses =
    normaliseArray(
      getFirstValue(
        college,
        [
          "courses",
          "course",
          "programmes",
          "programs",
          "degrees"
        ],
        ["MBBS"]
      )
    );


  const annualFee =
    extractNumber(
      getFirstValue(
        college,
        [
          "annualFee",
          "annual_fee",
          "fees",
          "fee",
          "tuitionFee",
          "tuition_fee",
          "mbbsFee",
          "mbbs_fee"
        ],
        0
      )
    );


  const seats =
    extractNumber(
      getFirstValue(
        college,
        [
          "seats",
          "totalSeats",
          "total_seats",
          "mbbsSeats",
          "mbbs_seats",
          "intake",
          "seatIntake",
          "seat_intake"
        ],
        0
      )
    );


  const established =
    toSafeString(
      getFirstValue(
        college,
        [
          "established",
          "establishedYear",
          "established_year",
          "year",
          "yearEstablished"
        ],
        "Not available"
      )
    );


  const website =
    toSafeString(
      getFirstValue(
        college,
        [
          "website",
          "officialWebsite",
          "official_website",
          "url",
          "link"
        ]
      )
    );


  const description =
    toSafeString(
      getFirstValue(
        college,
        [
          "description",
          "about",
          "summary",
          "overview"
        ],
        "Government medical college offering medical education and clinical training."
      )
    );


  const type =
    toSafeString(
      getFirstValue(
        college,
        [
          "type",
          "ownership",
          "collegeType",
          "college_type"
        ],
        "Government"
      )
    );


  const counselling =
    toSafeString(
      getFirstValue(
        college,
        [
          "counselling",
          "counsellingAuthority",
          "counselling_authority",
          "admissionAuthority",
          "admission_authority"
        ],
        "NEET Counselling"
      )
    );


  const location =
    [city, state]
      .filter(Boolean)
      .join(", ") ||
    "Location not available";


  return {
    id:
      toSafeString(
        getFirstValue(
          college,
          [
            "id",
            "collegeId",
            "college_id",
            "slug"
          ],
          `government-college-${index + 1}`
        )
      ),

    name: collegeName,
    city,
    state,
    location,
    university,
    courses:
      courses.length
        ? courses
        : ["MBBS"],
    annualFee,
    seats,
    established,
    website,
    description,
    type,
    counselling
  };

}


/*==================================================
  EXTRACT COLLEGE ARRAY FROM JSON
==================================================*/

function extractCollegeArray(data) {

  if (Array.isArray(data)) {
    return data;
  }

  const possibleArrays = [
    data?.colleges,
    data?.governmentColleges,
    data?.government_colleges,
    data?.medicalColleges,
    data?.medical_colleges,
    data?.institutions,
    data?.data,
    data?.results
  ];

  for (const possibleArray of possibleArrays) {

    if (Array.isArray(possibleArray)) {
      return possibleArray;
    }

  }

  if (
    data &&
    typeof data === "object"
  ) {

    const firstArray =
      Object.values(data)
        .find(function (value) {
          return Array.isArray(value);
        });

    if (firstArray) {
      return firstArray;
    }

  }

  return [];

}


/*==================================================
  LOAD JSON DATA
==================================================*/

async function loadCollegeData() {

  showLoadingState();

  try {

    const response =
      await fetch(
        GOVERNMENT_COLLEGE_DATA_URL,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `JSON file returned status ${response.status}`
      );

    }


    const data =
      await response.json();


    const collegeArray =
      extractCollegeArray(data);


    if (!collegeArray.length) {

      throw new Error(
        "No college records were found inside the JSON file."
      );

    }


    allColleges =
      collegeArray
        .map(normaliseCollege)
        .filter(function (college) {
          return college.name;
        });


    if (!allColleges.length) {

      throw new Error(
        "The JSON file does not contain valid college information."
      );

    }


    createFilterOptions();
    updateStatistics();

    filteredColleges = [...allColleges];
    visibleLimit = COLLEGES_PER_PAGE;

    hideAllStates();
    applyFilters();

  } catch (error) {

    console.error(
      "Government college loading error:",
      error
    );

    showErrorState(
      error.message ||
      "Unable to load college information."
    );

  }

}


/*==================================================
  CREATE FILTER OPTIONS
==================================================*/

function createFilterOptions() {

  const states =
    [...new Set(
      allColleges
        .map(function (college) {
          return college.state;
        })
        .filter(Boolean)
    )]
      .sort(function (a, b) {
        return a.localeCompare(b);
      });


  const courses =
    [...new Set(
      allColleges
        .flatMap(function (college) {
          return college.courses;
        })
        .filter(Boolean)
    )]
      .sort(function (a, b) {
        return a.localeCompare(b);
      });


  stateFilter.innerHTML =
    '<option value="">All States</option>';


  states.forEach(function (state) {

    const option =
      document.createElement("option");

    option.value = state;
    option.textContent = state;

    stateFilter.appendChild(option);

  });


  courseFilter.innerHTML =
    '<option value="">All Courses</option>';


  courses.forEach(function (course) {

    const option =
      document.createElement("option");

    option.value = course;
    option.textContent = course;

    courseFilter.appendChild(option);

  });

}


/*==================================================
  UPDATE STATISTICS
==================================================*/

function updateStatistics() {

  const states =
    new Set(
      allColleges
        .map(function (college) {
          return college.state;
        })
        .filter(Boolean)
    );


  const courses =
    new Set(
      allColleges
        .flatMap(function (college) {
          return college.courses;
        })
        .filter(Boolean)
    );


  totalCollegeCount.textContent =
    formatIndianNumber(allColleges.length);

  totalStateCount.textContent =
    formatIndianNumber(states.size);

  totalCourseCount.textContent =
    formatIndianNumber(courses.size);

}


/*==================================================
  FILTER COLLEGES
==================================================*/

function applyFilters() {

  const searchValue =
    collegeSearch.value
      .trim()
      .toLowerCase();

  const selectedState =
    stateFilter.value
      .trim()
      .toLowerCase();

  const selectedCourse =
    courseFilter.value
      .trim()
      .toLowerCase();

  const selectedFee =
    feeFilter.value;


  filteredColleges =
    allColleges.filter(function (college) {

      const searchableContent =
        [
          college.name,
          college.city,
          college.state,
          college.location,
          college.university,
          college.type,
          college.counselling,
          college.courses.join(" ")
        ]
          .join(" ")
          .toLowerCase();


      const matchesSearch =
        !searchValue ||
        searchableContent.includes(searchValue);


      const matchesState =
        !selectedState ||
        college.state
          .toLowerCase() === selectedState;


      const matchesCourse =
        !selectedCourse ||
        college.courses.some(function (course) {

          return course
            .toLowerCase() === selectedCourse;

        });


      const matchesFee =
        checkFeeRange(
          college.annualFee,
          selectedFee
        );


      return (
        matchesSearch &&
        matchesState &&
        matchesCourse &&
        matchesFee
      );

    });


  sortColleges();

  visibleLimit = COLLEGES_PER_PAGE;

  renderColleges();

}


/*==================================================
  FEE FILTER
==================================================*/

function checkFeeRange(
  collegeFee,
  selectedRange
) {

  if (!selectedRange) {
    return true;
  }

  const [minimumFee, maximumFee] =
    selectedRange
      .split("-")
      .map(Number);


  return (
    collegeFee >= minimumFee &&
    collegeFee <= maximumFee
  );

}


/*==================================================
  SORT COLLEGES
==================================================*/

function sortColleges() {

  const sortValue =
    sortFilter.value;


  filteredColleges.sort(function (a, b) {

    switch (sortValue) {

      case "name-desc":
        return b.name.localeCompare(a.name);


      case "fee-low":

        if (!a.annualFee && b.annualFee) {
          return 1;
        }

        if (a.annualFee && !b.annualFee) {
          return -1;
        }

        return a.annualFee - b.annualFee;


      case "fee-high":
        return b.annualFee - a.annualFee;


      case "seats-high":
        return b.seats - a.seats;


      case "name-asc":
      default:
        return a.name.localeCompare(b.name);

    }

  });

}


/*==================================================
  RENDER COLLEGE CARDS
==================================================*/

function renderColleges() {

  hideAllStates();

  visibleCollegeCount.textContent =
    formatIndianNumber(filteredColleges.length);


  if (!filteredColleges.length) {

    collegeGrid.innerHTML = "";

    emptyState.classList.remove("hidden");
    loadMoreWrapper.classList.add("hidden");

    return;

  }


  const visibleColleges =
    filteredColleges.slice(
      0,
      visibleLimit
    );


  collegeGrid.innerHTML =
    visibleColleges
      .map(createCollegeCard)
      .join("");


  collegeGrid.classList.remove("hidden");


  if (
    visibleLimit <
    filteredColleges.length
  ) {

    loadMoreWrapper.classList.remove("hidden");

  } else {

    loadMoreWrapper.classList.add("hidden");

  }

}


/*==================================================
  CREATE COLLEGE CARD
==================================================*/

function createCollegeCard(college) {

  const courseTags =
    college.courses
      .slice(0, 4)
      .map(function (course) {

        return `
          <span class="course-tag">
            ${escapeHTML(course)}
          </span>
        `;

      })
      .join("");


  const remainingCourses =
    college.courses.length - 4;


  const remainingCourseTag =
    remainingCourses > 0
      ? `
        <span class="course-tag">
          +${remainingCourses} more
        </span>
      `
      : "";


  const officialWebsite =
    createSafeWebsiteURL(
      college.website
    );


  const websiteButton =
    officialWebsite
      ? `
        <a
          href="${escapeHTML(officialWebsite)}"
          target="_blank"
          rel="noopener noreferrer"
          class="college-official-link"
          aria-label="Open official website of ${escapeHTML(college.name)}"
          title="Official website"
        >
          ↗
        </a>
      `
      : `
        <span
          class="college-official-link"
          aria-label="Official website unavailable"
          title="Official website unavailable"
        >
          --
        </span>
      `;


  return `
    <article
      class="college-card"
      data-college-id="${escapeHTML(college.id)}"
    >

      <div class="college-card-top">

        <span class="college-status">
          ${escapeHTML(college.type)}
        </span>

        <p class="college-location">
          📍 ${escapeHTML(college.location)}
        </p>

      </div>


      <div class="college-card-body">

        <h3>
          ${escapeHTML(college.name)}
        </h3>

        <p class="college-university">
          ${escapeHTML(college.university)}
        </p>


        <div class="college-meta">

          <div class="college-meta-item">

            <span>Annual Fee</span>

            <strong>
              ${formatCurrency(college.annualFee)}
            </strong>

          </div>


          <div class="college-meta-item">

            <span>Total Seats</span>

            <strong>
              ${
                college.seats
                  ? formatIndianNumber(college.seats)
                  : "Not available"
              }
            </strong>

          </div>


          <div class="college-meta-item">

            <span>Established</span>

            <strong>
              ${escapeHTML(college.established)}
            </strong>

          </div>


          <div class="college-meta-item">

            <span>Admission</span>

            <strong>
              ${escapeHTML(college.counselling)}
            </strong>

          </div>

        </div>


        <div class="college-courses">
          ${courseTags}
          ${remainingCourseTag}
        </div>


        <p class="college-description">
          ${escapeHTML(college.description)}
        </p>


        <div class="college-card-footer">

          <a
            href="contact.html?college=${encodeURIComponent(college.name)}"
            class="college-details-button"
          >
            Request Information
          </a>

          ${websiteButton}

        </div>

      </div>

    </article>
  `;

}


/*==================================================
  SAFE WEBSITE URL
==================================================*/

function createSafeWebsiteURL(value) {

  const website =
    toSafeString(value);

  if (!website) {
    return "";
  }

  try {

    const completeURL =
      /^https?:\/\//i.test(website)
        ? website
        : `https://${website}`;


    const url =
      new URL(completeURL);


    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return "";
    }


    return url.href;

  } catch {

    return "";

  }

}


/*==================================================
  LOAD MORE
==================================================*/

if (loadMoreButton) {

  loadMoreButton.addEventListener(
    "click",
    function () {

      visibleLimit += COLLEGES_PER_PAGE;

      renderColleges();

    }
  );

}


/*==================================================
  FILTER EVENTS
==================================================*/

let searchTimer;


if (collegeSearch) {

  collegeSearch.addEventListener(
    "input",
    function () {

      window.clearTimeout(searchTimer);

      searchTimer =
        window.setTimeout(
          applyFilters,
          250
        );

    }
  );

}


[
  stateFilter,
  courseFilter,
  feeFilter,
  sortFilter
]
  .filter(Boolean)
  .forEach(function (filterElement) {

    filterElement.addEventListener(
      "change",
      applyFilters
    );

  });


/*==================================================
  RESET FILTERS
==================================================*/

function resetAllFilters() {

  collegeSearch.value = "";
  stateFilter.value = "";
  courseFilter.value = "";
  feeFilter.value = "";
  sortFilter.value = "name-asc";

  visibleLimit = COLLEGES_PER_PAGE;

  applyFilters();

}


if (resetFiltersButton) {

  resetFiltersButton.addEventListener(
    "click",
    resetAllFilters
  );

}


if (clearSearchButton) {

  clearSearchButton.addEventListener(
    "click",
    resetAllFilters
  );

}


/*==================================================
  GRID AND LIST VIEW
==================================================*/

if (
  gridViewButton &&
  listViewButton
) {

  gridViewButton.addEventListener(
    "click",
    function () {

      collegeGrid.classList.remove(
        "list-view"
      );

      gridViewButton.classList.add(
        "active"
      );

      listViewButton.classList.remove(
        "active"
      );

      localStorage.setItem(
        "medorbitCollegeView",
        "grid"
      );

    }
  );


  listViewButton.addEventListener(
    "click",
    function () {

      collegeGrid.classList.add(
        "list-view"
      );

      listViewButton.classList.add(
        "active"
      );

      gridViewButton.classList.remove(
        "active"
      );

      localStorage.setItem(
        "medorbitCollegeView",
        "list"
      );

    }
  );

}


/*==================================================
  RESTORE SAVED VIEW
==================================================*/

function restoreSavedView() {

  const savedView =
    localStorage.getItem(
      "medorbitCollegeView"
    );


  if (
    savedView === "list" &&
    listViewButton
  ) {

    collegeGrid.classList.add(
      "list-view"
    );

    listViewButton.classList.add(
      "active"
    );

    gridViewButton.classList.remove(
      "active"
    );

  }

}


/*==================================================
  PAGE STATES
==================================================*/

function hideAllStates() {

  loadingState?.classList.add("hidden");
  errorState?.classList.add("hidden");
  emptyState?.classList.add("hidden");
  collegeGrid?.classList.add("hidden");
  loadMoreWrapper?.classList.add("hidden");

}


function showLoadingState() {

  hideAllStates();

  loadingState?.classList.remove("hidden");

}


function showErrorState(message) {

  hideAllStates();

  if (errorMessage) {
    errorMessage.textContent = message;
  }

  errorState?.classList.remove("hidden");

}


/*==================================================
  RETRY BUTTON
==================================================*/

if (retryButton) {

  retryButton.addEventListener(
    "click",
    loadCollegeData
  );

}


/*==================================================
  ESCAPE KEY CLOSES MENU
==================================================*/

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      mainNavigation?.classList.remove(
        "open"
      );

      menuButton?.classList.remove(
        "active"
      );

      menuButton?.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }
);


/*==================================================
  START PAGE
==================================================*/

document.addEventListener(
  "DOMContentLoaded",
  function () {

    restoreSavedView();
    loadCollegeData();

  }
);