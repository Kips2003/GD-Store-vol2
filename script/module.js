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
  