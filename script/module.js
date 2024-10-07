// Function to check the width and update the display property for search

export function updateSearchDisplay() {

  const search = document.querySelector(".search");
  const documentWidth = document.documentElement.clientWidth;

  if (documentWidth < 720) {
    // Move the search bar into a different container on small screens
    document.querySelector(".sign-log").appendChild(search);
    search.style.order = "0";
    search.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    search.style.cursor = "pointer";

    // Add click event to display the search input
    search.addEventListener("click", () => {
      let searchSection = document.querySelector(".search-main");
      if (searchSection) {
        // If search section exists, toggle its visibility
        if (
          searchSection.style.display ===
          "none" /*|| searchSection.style.display === ''*/
        ) {
          searchSection.style.display = "block"; // Make sure it's visible
        } else {
          searchSection.style.display = "none"; // Hide it again on subsequent clicks
        }
      } else {
        // If search section doesn't exist, create and append it at the top of the main element
        const searchMain = document.createElement("section");
        searchMain.classList.add("search-main");
        searchMain.innerHTML = `
                    <input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   Search"/>
                `;
        searchMain.style.padding = "10px"; // Add some padding to make it noticeable
        searchMain.style.backgroundColor = "#fff8f2"; // Ensure background is visible
        searchMain.style.position = "fixed"; // So it shows in flow of the page
        searchMain.style.zIndex = "12"; // Keep it above other content

        // Insert the searchMain element as the first child of the main element
        document
          .querySelector("main")
          .insertBefore(searchMain, document.querySelector("main").firstChild);
      }
    });
  } else {
    // Move the search bar back and restore its appearance on larger screens
    document.querySelector(".wraper").appendChild(search);
    search.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   S e a r c h"/>`;
    search.style.order = "2";
    let searchSection = document.querySelector(".search-main");
    //searchSection.style.display = "none";
    if (searchSection) {
      searchSection.style.display = "none"; // Hide the extra search section on larger screens
    }
  }
}
  

export function checkForUser(){
  window.addEventListener("DOMContentLoaded", () => {
    function getCookie(name){
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if(parts.length === 2) return parts.pop().split(';').shift();
    }

    const userToken = getCookie('AuthToken');

    const changeIfUserExists = document.querySelector('.sign-log');
    
    if(userToken){
      const user = jwt_decode(userToken);

      changeIfUserExists.innerHTML = 
        `<div class="cart">
        <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <div class="user" id="user" style="border-radius: 50%; width: 20px; height: 20px; border-color: #2c1b13; border-width: 3px; border-style: solid;">
          <img src="${user.profilePicture}" alt="">
        </div>`;
    }
  })
}



/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/jwt-decode@3.1.2/build/jwt-decode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var n="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(n){var t=String(n).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var r,o,i=0,a=0,d="";o=t.charAt(a++);~o&&(r=i%4?64*r+o:o,i++%4)?d+=String.fromCharCode(255&r>>(-2*i&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return d};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(n(e).replace(/(.)/g,(function(e,n){var t=n.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return n(t)}}function r(e){this.message=e}function o(e,n){if("string"!=typeof e)throw new r("Invalid token specified");var o=!0===(n=n||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new r("Invalid token specified: "+e.message)}}r.prototype=new Error,r.prototype.name="InvalidTokenError",window&&("function"==typeof window.define&&window.define.amd?window.define("jwt_decode",(function(){return o})):window&&(window.jwt_decode=o))}));
//# sourceMappingURL=/sm/0a1993eaaca959f022d8cfa3468ac4af037652225e251eb84302d7be2af6b198.map