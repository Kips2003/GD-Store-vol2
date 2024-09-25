const search = document.querySelector(".search");

// Function to check the width and update the display property for search
function updateSearchDisplay() {
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

// Run the function on page load
updateSearchDisplay();

// Add the event listener for window resize to update the search bar display dynamically
window.addEventListener("resize", updateSearchDisplay);



function fetchAllProducts(){
  fetch("https://gd-store.ge/api/Product") // Adjust this API endpoint as per your backend
  .then(response => response.json())
  .then(data => displayProducts(data))
  .catch(error => console.error('Error fetching products:', error));
}

function fetchProductsByQuery(title){
  fetch(`https://gd-store.ge/api/Product/WithTitle/${title}`)
  .then(response => response.json())
  .then(data => displayProducts(data))
  .catch(error => console.error('Error fetching products:', error));
}


let productDiv = document.getElementById("products");

function displayProducts(products){
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let averageRating = 0;

    productDiv.innerHTML += `<div id="product${product.Id}" class="product-wraper">
          <div class="photo">
              <img class="main-page-photo" src="${product.Thumbnail}" alt="">
          </div>
          <h2 class="title">
              ${product.Title}
          </h2>
          <div class="price-rating">
              <div class="rating">
                  <i class="fa-solid fa-star"></i>
                  <p>${averageRating}</p>
              </div>
              <p class="price">
                  ${product.Price}.00$
              </p>
          </div>
      </div>`;
  }


  for (let i = 0; i < products.length; i++) {
    let product = products[i];

    document
      .getElementById(`product${product.Id}`)
      .addEventListener("click", () => {
        console.log(product.Id);
        window.location.href = `product.html?id=${product.Id}`;
      });
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Main execution
const title = getQueryParam('title');

if (title) {
  // If there's a query, fetch and display products by search query
  fetchProductsByQuery(title);
} else {
  // Otherwise, fetch and display all products
  fetchAllProducts();
}

document.getElementById('iconified').addEventListener('keydown', function(event) {
  // Check if the Enter key was pressed
  if (event.Ekey === "Enter" || event.keyCode === 13) {
      const title = event.target.value;

      // Redirect to shopping.html with the query
      if (title) {
          window.location.href = `shopping.html?title=${encodeURIComponent(title)}`;
      } else {
          window.location.href = 'shopping.html'; // Default to show all products
      }
  }
});



