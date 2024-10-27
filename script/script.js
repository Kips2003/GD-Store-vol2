//IMPORTING MODULES
import { checkForUser, updateSearchDisplay } from "./module.js";

//DOM ELEMENTS
const secTwo = document.querySelector(".sec-two-wraper");
const secThree = document.querySelector(".sec-three-wraper");
const loginButton = document.querySelector(".log-in");
const registerButton = document.querySelector(".sign-in");
const shopNowButton = document.querySelector(".shop-now");
const searchInput = document.getElementById('iconified');


// INTIFIALIZATION
updateSearchDisplay();
checkForUser();



// EVENT LISTENERS
window.addEventListener("resize", updateSearchDisplay);
shopNowButton.addEventListener("click", handleShopNowClick);
loginButton.addEventListener("click", () => navigateTo("loginPage.html"));
registerButton.addEventListener("click", () => navigateTo("registrationPage.html"));
searchInput.addEventListener('keydown', handleSearchInput);

// SET CURSOR STYLE
setCursorStyle([loginButton, registerButton, shopNowButton], "pointer");


// INTERSECTION OBSERVER
setupIntersectionObserver(secTwo, "secTwo");
setupIntersectionObserver(secThree, "secThree");

// SHOP LINKS SMOOTH SCROLL
setupShopLinksScrolling();

// FUNCTION DEFINITIONS
function handleShopNowClick() {
  navigateTo("shopping.html?title=&page=1");
}

function navigateTo(url) {
  window.location.href = url;
}

function setCursorStyle(elements, style) {
  elements.forEach(element => element.style.cursor = style);
}

function setupIntersectionObserver(element, name) {
  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        element.classList.add("animate");
        animated = true;
        observer.unobserve(element);
      }
    });
  }, { root: null, rootMargin: "0px", threshold: 0.05 });
  
  observer.observe(element);
}

function setupShopLinksScrolling() {
  shopLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.dataset.target;
      const targetElement = document.getElementById(targetId);
      animatePadding(targetElement);
      scrollToSection(event, `#${targetId}`);
    });
  });
}

function scrollToSection(event, sectionId) {
  event.preventDefault();
  const section = document.querySelector(sectionId);
  const offset = -110; // Adjust this to your header height
  const bodyRect = document.body.getBoundingClientRect().top;
  const sectionRect = section.getBoundingClientRect().top;
  const sectionPosition = sectionRect - bodyRect;
  const offsetPosition = sectionPosition + offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

function animatePadding(element) {
  element.style.padding = "30px";
  setTimeout(() => {
    element.style.padding = "20px";
  }, 150);
}

function handleSearchInput(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    const title = event.target.value;
    let currentParams = new URLSearchParams(window.location.search);
    currentParams.set('page', 1);

    if (title) {
      currentParams.set('title', title);
    } else {
      currentParams.delete('title');
    }

    navigateTo("shopping.html?" + currentParams.toString());
  }
}

