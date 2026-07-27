"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const collegeGrid = document.getElementById("collegeGrid");
  const searchInput = document.getElementById("collegeSearch");
  const courseFilter = document.getElementById("courseFilter");
  const typeFilter = document.getElementById("collegeType");
  const countryFilter = document.getElementById("countryFilter");
  const stateFilter = document.getElementById("stateFilter");
  const sortFilter = document.getElementById("sortFilter");
  const viewMoreButton = document.getElementById("viewMoreColleges");
  const resultCount = document.getElementById("collegeResultCount");

  if (!collegeGrid) {
    console.error("Missing #collegeGrid in pages/colleges.html");
    return;
  }

  const DATASETS = [
    "../assets/data/government-medical.json",
    "../assets/data/private-medical.json",

    "../assets/data/abroad/nepal.json",
    "../assets/data/abroad/russia.json",
    "../assets/data/abroad/georgia.json",
    "../assets/data/abroad/kazakhstan.json"
  ];

  const DEFAULT_IMAGE =
    "../assets/images/colleges/default.jpg";

  const INITIAL_LIMIT = 12;
  const LOAD_MORE_COUNT = 12;

  let allColleges = [];
  let filteredColleges = [];
  let visibleLimit = INITIAL_LIMIT;

  initialise();

  async function initialise() {
    showLoading();

    allColleges = await loadAllDatasets();

    allColleges = allColleges
      .filter(isActiveCollege)
      .map(normaliseCollege);

    filteredColleges = [...allColleges];

    populateCountryFilter();
    populateStateFilter();
    renderColleges();
    attachEvents();
  }

  async function loadAllDatasets() {
    const results = await Promise.allSettled(
      DATASETS.map(loadDataset)
    );

    return results.flatMap(result => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      console.warn(
        "A college dataset could not be loaded:",
        result.reason
      );

      return [];
    });
  }

  async function loadDataset(path) {
    const response = await fetch(path, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `${path} returned ${response.status}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data.colleges)) {
      return data.colleges;
    }

    if (Array.isArray(data.universities)) {
      return data.universities;
    }

    return [];
  }

  function normaliseCollege(college) {
    return {
      ...college,

      id:
        college.id ??
        `${college.slug || "college"}-${Math.random()}`,

      name:
        college.name ||
        college.shortName ||
        "College name unavailable",

      shortName:
        college.shortName || "",

      country:
        college.country || "India",

      state:
        college.state ||
        college.stateOrRegion ||
        "",

      city:
        college.city || "",

      ownership:
        college.ownership ||
        "Institution",

      courseCategory:
        college.courseCategory ||
        college.category ||
        "Education",

      courses:
        Array.isArray(college.courses)
          ? college.courses
          : college.course
            ? [college.course]
            : [],

      entranceExams:
        Array.isArray(college.entranceExams)
          ? college.entranceExams
          : college.entrance
            ? [college.entrance]
            : college.primaryEntrance
              ? [college.primaryEntrance]
              : [],

      image:
        college.images?.thumbnail ||
        college.image ||
        DEFAULT_IMAGE,

      officialWebsite:
        college.officialWebsite ||
        college.website ||
        "",

      featured:
        Boolean(college.featured),

      popular:
        Boolean(college.popular),

      hostelAvailable:
        college.hostelAvailable ??
        college.hostel ??
        null,

      scholarshipAvailable:
        college.scholarshipAvailable ??
        college.scholarship ??
        null,

      admissionOpen:
        college.admissionOpen ?? null,

      status:
        college.status || "Active"
    };
  }

  function isActiveCollege(college) {
    return !college.status ||
      college.status.toLowerCase() === "active";
  }

  function attachEvents() {
    searchInput?.addEventListener(
      "input",
      debounce(applyFilters, 250)
    );

    [
      courseFilter,
      typeFilter,
      countryFilter,
      stateFilter,
      sortFilter
    ].forEach(filter => {
      filter?.addEventListener("change", () => {
        if (filter === countryFilter) {
          populateStateFilter();
        }

        applyFilters();
      });
    });

    viewMoreButton?.addEventListener(
      "click",
      handleViewMore
    );

    document
      .querySelectorAll(".popular-searches button")
      .forEach(button => {
        button.addEventListener("click", () => {
          if (!searchInput) return;

          searchInput.value =
            button.textContent.trim();

          applyFilters();

          document
            .getElementById("college-directory")
            ?.scrollIntoView({
              behavior: "smooth"
            });
        });
      });
  }

  function applyFilters() {
    visibleLimit = INITIAL_LIMIT;

    const searchTerm =
      searchInput?.value
        .trim()
        .toLowerCase() || "";

    const selectedCourse =
      courseFilter?.value || "all";

    const selectedType =
      typeFilter?.value || "all";

    const selectedCountry =
      countryFilter?.value || "all";

    const selectedState =
      stateFilter?.value || "all";

    filteredColleges = allColleges.filter(
      college => {
        const searchableText = [
          college.name,
          college.shortName,
          college.country,
          college.state,
          college.city,
          college.ownership,
          college.courseCategory,
          ...college.courses,
          ...college.entranceExams,
          ...(college.keywords || [])
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !searchTerm ||
          searchableText.includes(searchTerm);

        const matchesCourse =
          selectedCourse === "all" ||
          college.courses.some(course =>
            course
              .toLowerCase()
              .includes(
                selectedCourse.toLowerCase()
              )
          );

        const matchesType =
          selectedType === "all" ||
          college.ownership
            .toLowerCase()
            .includes(
              selectedType.toLowerCase()
            );

        const matchesCountry =
          selectedCountry === "all" ||
          college.country === selectedCountry;

        const matchesState =
          selectedState === "all" ||
          college.state === selectedState;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesType &&
          matchesCountry &&
          matchesState
        );
      }
    );

    sortColleges();
    renderColleges();
  }

  function sortColleges() {
    const sortValue =
      sortFilter?.value || "featured";

    filteredColleges.sort((first, second) => {
      if (sortValue === "name-asc") {
        return first.name.localeCompare(
          second.name
        );
      }

      if (sortValue === "name-desc") {
        return second.name.localeCompare(
          first.name
        );
      }

      if (sortValue === "oldest") {
        return (
          Number(first.established || 9999) -
          Number(second.established || 9999)
        );
      }

      if (sortValue === "newest") {
        return (
          Number(second.established || 0) -
          Number(first.established || 0)
        );
      }

      return (
        Number(second.featured) -
          Number(first.featured) ||
        Number(second.popular) -
          Number(first.popular) ||
        first.name.localeCompare(second.name)
      );
    });
  }

  function renderColleges() {
    if (!filteredColleges.length) {
      showEmptyState();
      updateResultCount();
      updateViewMoreButton();
      return;
    }

    const visibleColleges =
      filteredColleges.slice(0, visibleLimit);

    collegeGrid.innerHTML =
      visibleColleges
        .map(createCollegeCard)
        .join("");

    updateResultCount();
    updateViewMoreButton();
  }

  function createCollegeCard(college) {
    const location = [
      college.city,
      college.state,
      college.country
    ]
      .filter(Boolean)
      .join(", ");

    const courses =
      college.courses.slice(0, 4);

    const entrances =
      college.entranceExams.slice(0, 2);

    const websiteButton =
      college.officialWebsite
        ? `
          <a
            href="${escapeHTML(
              college.officialWebsite
            )}"
            class="college-btn college-btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Website
          </a>
        `
        : "";

    return `
      <article
        class="college-card"
        data-id="${escapeHTML(
          String(college.id)
        )}"
      >
        <div class="college-image">

          <img
            src="${escapeHTML(college.image)}"
            alt="${escapeHTML(college.name)}"
            loading="lazy"
            onerror="this.onerror=null;
            this.src='${DEFAULT_IMAGE}'"
          >

          <div class="college-badges">

            ${
              college.featured
                ? `
                  <span class="college-badge featured">
                    Featured
                  </span>
                `
                : ""
            }

            ${
              college.admissionOpen === true
                ? `
                  <span class="college-badge admission">
                    Admission Open
                  </span>
                `
                : ""
            }

          </div>

        </div>

        <div class="college-content">

          <div class="college-meta">

            <span>
              ${escapeHTML(
                college.ownership
              )}
            </span>

            ${
              college.established
                ? `
                  <span>
                    Est. ${escapeHTML(
                      String(
                        college.established
                      )
                    )}
                  </span>
                `
                : ""
            }

          </div>

          <h3>
            ${escapeHTML(college.name)}
          </h3>

          <p class="college-location">
            📍 ${escapeHTML(
              location ||
              "Location information unavailable"
            )}
          </p>

          <div class="college-tags">

            ${courses
              .map(
                course => `
                  <span>
                    ${escapeHTML(course)}
                  </span>
                `
              )
              .join("")}

          </div>

          ${
            entrances.length
              ? `
                <p class="college-entrance">
                  <strong>Entrance:</strong>
                  ${escapeHTML(
                    entrances.join(" • ")
                  )}
                </p>
              `
              : ""
          }

          <div class="college-facilities">

            ${
              college.hostelAvailable === true
                ? "<span>🏠 Hostel</span>"
                : ""
            }

            ${
              college.scholarshipAvailable === true
                ? "<span>🎓 Scholarship</span>"
                : ""
            }

            ${
              college.medium
                ? `
                  <span>
                    🗣 ${escapeHTML(
                      college.medium
                    )}
                  </span>
                `
                : ""
            }

          </div>

          <div class="college-actions">

            <a
              href="contact.html?college=${encodeURIComponent(
                college.name
              )}"
              class="college-btn"
            >
              Get Guidance
            </a>

            ${websiteButton}

          </div>

        </div>

      </article>
    `;
  }

  function handleViewMore() {
    if (
      visibleLimit >=
      filteredColleges.length
    ) {
      visibleLimit = INITIAL_LIMIT;

      document
        .getElementById("college-directory")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    } else {
      visibleLimit += LOAD_MORE_COUNT;
    }

    renderColleges();
  }

  function populateCountryFilter() {
    if (!countryFilter) return;
    document.addEventListener("DOMContentLoaded", () => {
  const collegeGrid =
    document.getElementById("collegeGrid");

  const collegeSearch =
    document.getElementById("collegeSearch");

  const courseFilter =
    document.getElementById("courseFilter");

  const collegeType =
    document.getElementById("collegeType");

  const stateFilter =
    document.getElementById("stateFilter");

  const countryFilter =
    document.getElementById("countryFilter");

  const resultCount =
    document.getElementById("resultCount");

  const viewMoreButton =
    document.getElementById("viewMoreColleges");

  let allColleges = [];
  let filteredColleges = [];
  let visibleCount = 6;

  const datasetFiles = [
    "../assets/data/government-medical.json",
    "../assets/data/private-medical.json",
    "../assets/data/abroad/nepal.json",
    "../assets/data/abroad/russia.json",
    "../assets/data/abroad/georgia.json",
    "../assets/data/abroad/kazakhstan.json"
  ];

  if (!collegeGrid) {
    console.error(
      "Missing #collegeGrid in colleges.html"
    );

    return;
  }

  loadCollegeData();

  async function loadCollegeData() {
    collegeGrid.innerHTML = `
      <div class="college-loading">
        Loading colleges...
      </div>
    `;

    try {
      const responses =
        await Promise.all(
          datasetFiles.map(loadDataset)
        );

      allColleges =
        responses
          .flat()
          .filter(Boolean);

      filteredColleges =
        [...allColleges];

      populateDynamicFilters();

      applyFilters();
    } catch (error) {
      console.error(
        "College database error:",
        error
      );

      collegeGrid.innerHTML = `
        <div class="college-error">
          College records could not be loaded.
        </div>
      `;
    }
  }

  async function loadDataset(filePath) {
    try {
      const response =
        await fetch(filePath);

      if (!response.ok) {
        console.warn(
          `Skipped missing dataset: ${filePath}`
        );

        return [];
      }

      const data =
        await response.json();

      if (Array.isArray(data.colleges)) {
        return data.colleges;
      }

      if (Array.isArray(data.universities)) {
        return data.universities;
      }

      return [];
    } catch (error) {
      console.warn(
        `Could not load ${filePath}`,
        error
      );

      return [];
    }
  }
});
    