import { KEY_CLIENT_DARK_MODE } from "./Constants";
import { storageSave } from "../services/local/LocalStorage";

export const getBodyEl = () => document.getElementsByTagName("BODY")[0];
export const getHeaderEl = () => document.getElementById("header");

export const toggleClientDarkMode = (newVal: boolean) => {
  // const html = document.documentElement;
  const body = getBodyEl();

  // Set dark mode => TRUE
  if (newVal === true) {
    body.classList.add("dark");
    body.setAttribute("data-theme", "forest");
  }
  // Set dark mode => FALSE
  else {
    body.classList.remove("dark");
    body.setAttribute("data-theme", "cupcake");
  }
  // Save dark mode to localStorage
  storageSave(KEY_CLIENT_DARK_MODE, JSON.stringify(newVal));
};

export const initClientDarkMode = (toggler: (val: boolean) => void) => {
  // // get client dark mode if exists
  // const clientDarkMode = JSON.parse(storageFind(KEY_CLIENT_DARK_MODE));
  // // if not initialized in storage
  // if (clientDarkMode === null) {
  //   // set depends on system
  //   // Check to see if Media-Queries are supported
  //   if (window.matchMedia) {
  //     const osDarkMode = window.matchMedia(
  //       "(prefers-color-scheme: dark)",
  //     ).matches;
  //     toggler(osDarkMode);
  //   } else {
  //     // Default (when Media-Queries are not supported)
  //     toggler(!!clientDarkMode);
  //   }
  // }
  // // if initialized
  // else {
  //   // set depends on the storage
  //   toggler(clientDarkMode);
  // }
  const body = getBodyEl();
  const onDarkMode =
    body.classList.contains("dark") && body.getAttribute("data-theme") !== "";
  toggler(onDarkMode);
};
