import { checkForUser } from "./module.js";
import { updateSearchDisplay } from "./module.js";

updateSearchDisplay();
checkForUser();
window.addEventListener("resize", updateSearchDisplay);

const loginButton = document.querySelector(".log-in");
const registerButton = document.querySelector(".sign-in");
loginButton.style.cursor = "pointer";
registerButton.style.cursor = "pointer";

loginButton.addEventListener("click", () => {
  window.location.href = "loginPage.html";
});

registerButton.addEventListener("click", () => {
  window.location.href = "registrationPage.html";
});


function fetchAllProducts(limit, page){
  fetch("https://gd-store.ge/api/Product") // Adjust this API endpoint as per your backend
  .then(response => response.json())
  .then(data => displayProducts(data, limit, page))
  .catch(error => console.error('Error fetching products:', error));
}

function fetchProductsByQuery(title, limit, page){
  console.log(title);
  console.log(typeof(title));
  fetch(`https://gd-store.ge/api/Product/WithTitle/${title}`)
  .then(response => response.json())
  .then(data => displayProducts(data, limit,page, title))
  .catch(error => console.error('Error fetching products:', error));
}

function storeViewedProduct(productId){
  let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

  if(!viewedProducts.includes(productId)){
    viewedProducts.push(productId);

    if(viewedProducts.length > 5){
      viewedProducts.shift();
    }

    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
  }
}

function displayViewedProducts() {
  const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

  // Loop through the viewed products and create elements to display them
  viewedProducts.forEach(productId => {
    const productContainer = document.getElementById(`product${productId}`);

    // Check if the element exists before modifying its content
    if (productContainer) {
      const justViewed = '<p>Just Viewed</p>';
      productContainer.innerHTML += justViewed;
    } else {
      console.warn(`Element with ID "product${productId}" not found on the page.`);
    }
  });
}

let productDiv = document.getElementById("products");

function displayProducts(products, maxProduct, page, title = ""){
  console.log(products);
  page = parseInt(page);
  if(products.length > 10){
    const pageCount =parseInt(products.length/10);
    for(let i = -1; i < pageCount; i++){
      document.querySelector('.pagination-wraper').innerHTML+= `<a href="shopping.html?limit=10&title=${title}&page=${i+2}">${i+2}</a>`;
    }
  }               
  if(page*10 > products.length){
    maxProduct = products.length - (page - 1)*10;
  }
  for (let i = 0; i < maxProduct; i++) {
    let index = i + ((page - 1) * 10);
    let product = products[index];
    let averageRating = 0;

    if (!product) {
      console.warn(`Product is undefined at index ${index}. Skipping...`);
      continue;  // Skip to the next iteration instead of returning
    }
  
    // Ensure that the product has an ID
    if (!product.id) {
      console.warn(`Product at index ${index} does not have an ID:`, product);
      continue;  // Skip this product if ID is missing
    }

    productDiv.innerHTML += `<div id="product${product.id}" class="product-wraper">
          <div class="photo">
              <img class="main-page-photo" src="https://gd-store.ge/${product.thumbnail}" alt="">
          </div>
          <h2 class="title">
              ${product.title}
          </h2>
          <div class="price-rating">
              <div class="rating">
                  <i class="fa-solid fa-star"></i>
                  <p>${averageRating}</p>
              </div>
              <p class="price">
                  ${product.price}.00$
              </p>
          </div>
      </div>`;
      
  }
  displayViewedProducts();


  for (let i = 0; i < maxProduct; i++) {
    let index = i + ((page - 1) * 10);
    let product = products[index];

    document.getElementById(`product${product.id}`)
      .addEventListener("click", () => {
        console.log(product.id);
        storeViewedProduct(product.id);
        window.location.href = `product.html?id=${product.id}`;
      });
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Main execution
const title = getQueryParam('title');
let pagination = getQueryParam('limit');
const pageNumber = getQueryParam("page");

if (title) {
  // If there's a query, fetch and display products by search query
  if(pageNumber)
    fetchProductsByQuery(title, pagination,pageNumber);
  else
  fetchProductsByQuery(title, pagination)
} else {
  // Otherwise, fetch and display all products
  if(pageNumber)
    fetchAllProducts(pagination, pageNumber);
  else
    fetchAllProducts(pagination);
}

document.getElementById('iconified').addEventListener('keydown', function(event) {
  // Check if the Enter key was pressed
  if (event.Ekey === "Enter" || event.keyCode === 13) {
      const title = event.target.value;

      // Redirect to shopping.html with the query
      if (title) {
          window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(title)}&page=1`;
      } else {
          window.location.href = 'shopping.html?limit=10&title=&page=1'; // Default to show all products
      }
  }
});



