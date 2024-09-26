import { updateSearchDisplay } from "./module.js";


// Run the function on page load
updateSearchDisplay();

// Add the event listener for window resize to update the search bar display dynamically
window.addEventListener("resize", updateSearchDisplay);

// IntersectionObserver to animate secTwo when it becomes visible on scroll
const secTwo = document.querySelector(".sec-two-wraper");
const secThree = document.querySelector(".sec-three-wraper");

let secTwoAnimated = false; // Separate flag for secTwo
let secThreeAnimated = false; // Separate flag for secThree

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.05,
};

// Observer for secTwo
let observerSecTwo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !secTwoAnimated) {
      secTwo.classList.add("animate"); // Trigger animation class for secTwo
      secTwoAnimated = true; // Prevent the animation from triggering multiple times
      observerSecTwo.unobserve(secTwo); // Stop observing secTwo after it animates
    }
  });
}, options);

observerSecTwo.observe(secTwo); // Observe secTwo

// Observer for secThree
let observerSecThree = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !secThreeAnimated) {
      secThree.classList.add("animate"); // Trigger animation class for secThree
      secThreeAnimated = true; // Prevent the animation from triggering multiple times
      observerSecThree.unobserve(secThree); // Stop observing secThree after it animates
    }
  });
}, options);

observerSecThree.observe(secThree); // Observe secThree

// Set the cursor style for the login and register buttons
const loginButton = document.querySelector(".log-in");
const registerButton = document.querySelector(".sign-in");
loginButton.style.cursor = "pointer";
registerButton.style.cursor = "pointer";

// Handle "Shop Now" button click
const shopNowButton = document.querySelector(".shop-now");
shopNowButton.style.cursor = "pointer";

shopNowButton.addEventListener("click", () => {
  window.location.href = "shopping.html?limit=10";
});

// Smooth scroll to section logic when clicking shop links
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

// Handle smooth scrolling for elements with the class "click-shop"
const shopLinks = document.querySelectorAll(".click-shop");
shopLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.dataset.target;
    document.getElementById(targetId).style.padding = "30px";
    setTimeout(() => {
      document.getElementById(targetId).style.padding = "20px"; // Restore original padding after a short delay
    }, 150);
  });
});

// adding event listeners to sign up and login buttons

loginButton.addEventListener("click", () => {
  window.location.href = "loginPage.html";
});

registerButton.addEventListener("click", () => {
  window.location.href = "registrationPage.html";
});


document.getElementById('iconified').addEventListener('keydown', function(event) {
  // Check if the Enter key was pressed
  if (event.key === "Enter" || event.keyCode === 13) {
      const query = event.target.value;

      // Redirect to shopping.html with the query
      // Redirect to shopping.html with the query
      if (title) {
        window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(title)}`;
    } else {
        window.location.href = 'shopping.html?limit=10'; // Default to show all products
    }
  }
});