// Function to check the width and update the display property for search
let isMobileEventListenerAdded = false; // Flag to keep track of the event listener state

// Function to update the search bar display based on screen size
export function updateSearchDisplay() {
  const search = document.querySelector(".search");
  const searchPlaceholder = document.querySelector(".search-placeholder");
  const documentWidth = document.documentElement.clientWidth;

  if (documentWidth < 720) {
    // Move the search bar into the sign-log container on small screens
    document.querySelector(".sign-log").appendChild(search);
    search.style.order = "0";
    search.innerHTML = `<i style="order: 1;" class="fa-solid fa-magnifying-glass"></i>`; // Change to magnifying glass icon
    search.style.cursor = "pointer";

    // Add click event to display the search input if not already added
    if (!isMobileEventListenerAdded) {
      search.addEventListener("click", handleMobileSearchClick);
      isMobileEventListenerAdded = true; // Set the flag to true
    }
  } else {
    // Move the search bar back to its original position on larger screens
    searchPlaceholder.appendChild(search);
    search.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="&#xF002; S e a r c h"/>`;
    search.style.order = "2";
    search.style.cursor = "text"; // Change back to default cursor for input

    // Remove the mobile click event listener when switching back to larger screens
    if (isMobileEventListenerAdded) {
      search.removeEventListener("click", handleMobileSearchClick);
      isMobileEventListenerAdded = false; // Set the flag to false
    }

    // Hide any previously created search sections for small screens
    let searchSection = document.querySelector(".search-main");
    if (searchSection) {
      searchSection.style.display = "none";
    }
  }
}

// Function to handle the mobile search bar click event
function handleMobileSearchClick() {
  let searchSection = document.querySelector(".search-main");
  if (searchSection) {
    // If search section exists, toggle its visibility
    searchSection.style.display = searchSection.style.display === "none" ? "block" : "none";
  } else {
    // If search section doesn't exist, create and append it at the top of the main element
    const searchMain = document.createElement("section");
    searchMain.classList.add("search-main");
    searchMain.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="Search..."/>`;
    searchMain.style.padding = "10px";
    searchMain.style.backgroundColor = "#fff8f2";
    searchMain.style.position = "fixed";
    searchMain.style.zIndex = "12";
    document.querySelector("main").insertBefore(searchMain, document.querySelector("main").firstChild);
  }
}

// Event Listener for resizing with debounce to optimize performance
let debounceTimeout;
window.addEventListener("resize", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    updateSearchDisplay();
  }, 300);
});

// Initial call to set the correct display on page load
updateSearchDisplay();
  

export function checkForUser(){
  window.addEventListener("DOMContentLoaded", () => {
    function getCookie(name){
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if(parts.length === 2) return parts.pop().split(';').shift();
    }

    const userToken = getCookie('authToken');

    const changeIfUserExists = document.querySelector('.sign-log');
    
    if(userToken){
      const decodedUser = jwt_decode(userToken);

      try{
        fetch(`https://gd-store.ge/api/Auth/${decodedUser.email}`) // Adjust this API endpoint as per your backend
        .then(response => response.json())
        .then(user => {
          console.log(user);
        
        const userProfilePicture = "https://gd-store.ge" + user.profilePicture;

        changeIfUserExists.innerHTML = 
        `<div class="header-icons">
            <div style="order: 2;" class="cart">
                <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div style="order: 2;" class="user" id="user">
                <img src="${userProfilePicture}" alt="User Profile Picture" />
                <div class="dropdown-menu" id="dropdownMenu">
                  <ul>
                      <li><a href="profile.html">Profile</a></li>
                      <li><a href="settings.html">Settings</a></li>
                      <li><a style="color: red;" href="logout.html">Log Out</a></li>
                  </ul>
              </div>
            </div>
        </div>`;
        addEventListenerToAddedUser();
        })
      }
      catch(e){
        console.log(e);
      }

    }
  })
}

function addEventListenerToAddedUser(){
  document.querySelector('.cart').addEventListener('click', () => {
    window.location.href = "cart.html";
});

const user = document.getElementById('user');
const dropdownMenu = document.getElementById('dropdownMenu');

user.addEventListener('click', (event) => {
    // Toggle the dropdown menu visibility
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';

    // Prevent the click event from bubbling up to the document
    event.stopPropagation();
});

// Hide dropdown when clicking outside of it
document.addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
});
}


/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/jwt-decode@3.1.2/build/jwt-decode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var n="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(n){var t=String(n).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var r,o,i=0,a=0,d="";o=t.charAt(a++);~o&&(r=i%4?64*r+o:o,i++%4)?d+=String.fromCharCode(255&r>>(-2*i&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return d};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(n(e).replace(/(.)/g,(function(e,n){var t=n.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return n(t)}}function r(e){this.message=e}function o(e,n){if("string"!=typeof e)throw new r("Invalid token specified");var o=!0===(n=n||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new r("Invalid token specified: "+e.message)}}r.prototype=new Error,r.prototype.name="InvalidTokenError",window&&("function"==typeof window.define&&window.define.amd?window.define("jwt_decode",(function(){return o})):window&&(window.jwt_decode=o))}));
//# sourceMappingURL=/sm/0a1993eaaca959f022d8cfa3468ac4af037652225e251eb84302d7be2af6b198.map