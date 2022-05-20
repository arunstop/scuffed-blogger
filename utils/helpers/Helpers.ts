import { KEY_CLIENT_DARK_MODE } from "./Constants1";
import { storageFind, storageSave } from "./LocalStorage";

export const toggleClientDarkMode = (newVal: boolean) => {
  const html = document.documentElement;
  if (newVal === true) {
    html.classList.add("dark");
    html.setAttribute("data-theme", "forest");
  } else {
    html.classList.remove("dark");
    html.setAttribute("data-theme", "cupcake");
  }
  storageSave(KEY_CLIENT_DARK_MODE, JSON.stringify(newVal));
};

export const initClientDarkMode = (toggler: (val: boolean) => void) => {
  // get client dark mode if exists
  const clientDarkMode = JSON.parse(storageFind(KEY_CLIENT_DARK_MODE));
  // if not initialized in storage
  if (clientDarkMode === null) {
    // set depends on system
    // Check to see if Media-Queries are supported
    if (window.matchMedia) {
      const osDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      toggler(osDarkMode);
    } else {
      // Default (when Media-Queries are not supported)
      toggler(!!clientDarkMode);
    }
  }
  // if initialized
  else {
    // set depends on the storage
    toggler(clientDarkMode);
  }
};
