// Function to check the width and update the display property for search
let isMobileEventListenerAdded = false; // Flag to keep track of the event listener state

// Function to update the search bar display based on screen size
export async function updateSearchDisplay() {
  const search = document.querySelector(".search");
  const searchPlaceholder = document.querySelector(".search-placeholder");
  const signLogContainer = document.querySelector(".sign-log");
  const documentWidth = document.documentElement.clientWidth;

  if (documentWidth < 720) {
    // Mobile layout
    if (signLogContainer && !signLogContainer.contains(search)) {
      signLogContainer.insertBefore(search, signLogContainer.firstChild);
    }
    search.style.order = "0";
    search.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    search.style.cursor = "pointer";

    if (!search.hasAttribute('data-mobile-listener')) {
      search.addEventListener("click", handleMobileSearchClick);
      search.setAttribute('data-mobile-listener', 'true');
    }
  } else {
    // Desktop layout
    if (searchPlaceholder && !searchPlaceholder.contains(search)) {
      searchPlaceholder.appendChild(search);
    }
    search.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="&#xF002; Search"/>`;
    search.style.order = "2";
    search.style.cursor = "text";

    if (search.hasAttribute('data-mobile-listener')) {
      search.removeEventListener("click", handleMobileSearchClick);
      search.removeAttribute('data-mobile-listener');
    }
  }

  // Ensure search is always visible
  search.style.display = 'block';
}
function handleSearchKeydown(event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    const title = event.target.value;
    if (title) {
      window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(title)}`;
    } else {
      window.location.href = 'shopping.html?limit=10'; // Default to show all products
    }
  }
}
// Function to handle the mobile search bar click event
export function handleMobileSearchClick() {
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
    searchMain.style.top = "0";
    searchMain.style.left = "0";
    searchMain.style.width = "100%";
    searchMain.style.zIndex = "1000";
    searchMain.style.marginTop = "90px";
    document.body.insertBefore(searchMain, document.body.firstChild);

    // Focus on the input
    searchMain.querySelector('input').focus();

    // Add event listener for search
    searchMain.querySelector('input').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
        if (searchTerm) {
          window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(searchTerm)}`;
        } else {
          window.location.href = 'shopping.html?limit=10';
        }
      }
    });
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
document.addEventListener('DOMContentLoaded', () => {
  updateSearchDisplay();
});

export async function checkForUser() {
  const userToken = getCookie('authToken');
  const changeIfUserExists = document.querySelector('.sign-log');
  
  if (userToken) {
    try {
      const decodedUser = jwt_decode(userToken);
      console.log(decodedUser + "this is decoded");
      
      const response = await fetch(`https://gd-store.ge/api/Auth/${decodedUser.email}`);
      const user = await response.json();
      console.log(user);
    
      const userProfilePicture = "https://gd-store.ge" + user.profilePicture;

      // Preserve the search icon
      const searchIcon = changeIfUserExists.querySelector('.search');

      changeIfUserExists.innerHTML = `
        <div class="header-icons">
          <div style="order: 2;" class="cart">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <div style="order: 2;" class="user" id="user">
            <img src="${userProfilePicture}" alt="User Profile Picture" />
          </div>
          <div class="dropdown-menu" id="dropdownMenu">
            <ul>
              <li><a href="profile.html?email=${user.email}">Profile</a></li>
              <li><a href="settings.html">Settings</a></li>
              <li id="logOut"><a style="color: red;">Log Out</a></li>
            </ul>
          </div>
        </div>`;

      // Re-add the search icon
      if (searchIcon) {
        changeIfUserExists.insertBefore(searchIcon, changeIfUserExists.firstChild);
      }

      addEventListenerToAddedUser();
    } catch (e) {
      console.error('Error in checkForUser:', e);
    }
  }
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


export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function getUserFromToken(){
  const userToken = getCookie('authToken');

  if(!userToken){
    alert('Need to Log In');
    return;
  }

  const decodedUser = jwt_decode(userToken);

  return  decodedUser;
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function logOut(){
  const userToken = getCookie('authToken');

  if(userToken){
    document.cookie = "authToken=; epires=Thy, 01 Jan1970 00:00:00 UTC; path=/;"

  }
  window.location.href = 'index.html';
}
// document.getElementById('logOut').addEventListener('click', async () => {
//   await logOut();
// })

export const jwt_decode = window.jwt_decode;
