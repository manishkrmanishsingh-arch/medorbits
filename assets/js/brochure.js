const lastUpdated =
  document.getElementById("lastUpdated");

if (lastUpdated) {
  lastUpdated.textContent =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
}