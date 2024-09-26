import { updateSearchDisplay } from "./module.js";

updateSearchDisplay();
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

function displayViewedProducts(){
  const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

    // Clear the container
    
    // Loop through the viewed products and create elements to display them
    viewedProducts.forEach(productId => {
        const productContainer = document.getElementById(`product${productId}`);
        const justViewed = '<p>Just Viwed</p>';

        productContainer.innerHTML += justViewed;
    });
}

let productDiv = document.getElementById("products");

function displayProducts(products, maxProduct, page = "1", title = ""){
  console.log(products);
  page = parseInt(page);
  if(products.length > 10){
    const pageCount =parseInt(products.length/10);
    for(let i = -1; i < pageCount; i++){
      document.querySelector('.pagination-wraper').innerHTML+= `<a href="shopping.html?limit=10&title=${title}&page=${i+2}">${i+2}</a>`;
    }
  }

  for (let i = 0; i < parseInt(maxProduct); i++) {
    let product = products[i+((page-1)*10)];
    let averageRating = 0;

    productDiv.innerHTML += `<div id="product${product.id}" class="product-wraper">
          <div class="photo">
              <img class="main-page-photo" src="${product.thumbnail}" alt="">
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

  for (let i = 0; i < products.length; i++) {
    let product = products[i];

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
          window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(title)}`;
      } else {
          window.location.href = 'shopping.html?limit=10'; // Default to show all products
      }
  }
});



