// === STRICT MODE === //
"use strict";

// === VARIABLES, CONSTANTS & DOM ELEMENTS === //
let loginBtn;
let registerBtn;
let loginForm;
let registerForm;
let sections = {};
const CSS_CLASSNAMES = {
  ACTIVE: "active"
};

// === EVENT LISTENERS === //
window.addEventListener("load", init);

// === METHODS === //

function init() {
  // Link DOM elements
  loginBtn = document.querySelector("#button-sign-in");
  registerBtn = document.querySelector("#button-sign-up");
  loginForm = document.querySelector("#login");
  registerForm = document.querySelector("#register");

  // Link DOM elements to sections
  sections.login = {
    option: loginBtn,
    form: loginForm
  }
  sections.register = {
    option: registerBtn,
    form: registerForm
  };

  // Add event listeners
  loginBtn.addEventListener("click", () => toggleSection("login"));
  registerBtn.addEventListener("click", () => toggleSection("register"));

  // Load by default last selected form
  registerForm.addEventListener("submit", () => { localStorage.setItem("current-option", "register") });
  loginForm.addEventListener("submit", () => { localStorage.setItem("current-option", "login") });

  let currentOption = localStorage.getItem("current-option");

  if (currentOption != null) {
    toggleSection(currentOption);

    if (currentOption == "login") {
      registerForm.querySelectorAll(".input-box__status.input-box__status--error")
        .forEach(error => {
          error.style.display = "none";
        });
    } else {
      loginForm.querySelectorAll(".input-box__status.input-box__status--error")
        .forEach(error => {
          error.style.display = "none";
        });
    }
  }
}

function toggleSection(sectionName) {
  if (!Object.keys(sections).includes(sectionName)) throw Error("Given section name does not exists. [given: " + sectionName + "]");

  for (let section in sections) {
    if (section == sectionName) {
      sections[section].option.classList.add(CSS_CLASSNAMES.ACTIVE);
      sections[section].form.classList.add(CSS_CLASSNAMES.ACTIVE);
    } else {
      sections[section].option.classList.remove(CSS_CLASSNAMES.ACTIVE);
      sections[section].form.classList.remove(CSS_CLASSNAMES.ACTIVE);
    }
  };
}