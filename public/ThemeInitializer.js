(function initTheme() {
  // Get dark mode key from the localStorage
  const clientDarkMode = JSON.parse(localStorage.getItem("DARK_MODE"));
  // Toggler Func
  function toggleDarkMode(darkMode) {
    const body = document.getElementsByTagName("BODY")[0];

    if (darkMode) {
      body.classList.add("dark");
      body.setAttribute("data-theme", "forest");
    } else {
      body.classList.remove("dark");
      body.setAttribute("data-theme", "cupcake");
    }
  }
  // Setting up dark mode, if dark mode is not set in local storage already
  if (clientDarkMode === null) {
    // set depends on system
    // Check to see if Media-Queries are supported
    if (window.matchMedia) {
      const osDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      toggleDarkMode(osDarkMode);
    } else {
      // Default (when Media-Queries are not supported)
      toggleDarkMode(!!clientDarkMode);
    }
  } 
  // Apply dark mode if is set in local storage
  else {
    toggleDarkMode(clientDarkMode);
  }
})();
