import { checkForUser } from "./module.js";
import { updateSearchDisplay } from "./module.js";


// login button to add event listener to
    const loginButton = document.querySelector(".log-in");
    loginButton.style.cursor = "pointer";


// register button to add event listener to
    const registerButton = document.querySelector(".sign-in");
    registerButton.style.cursor = "pointer";


// productDiv from DOM manipulations
    let productDiv = document.getElementById("products");


// container of pagination to quckly change amount of products on the single page
    let pagination = 12;


// getting all the info from url
    const pageNumber = getQueryParam("page");
    const title = getQueryParam('title');
    const category = getQueryParam('category');
    const minPrice = getQueryParam('minPrice');
    const maxPrice = getQueryParam('maxPrice');

// 
// 
// functions section
// 
// 

// 
// fetch product function, to fetch any kind of product also with adding filtrations
// 
    async function fetchProducts({title, category, minPrice, maxPrice} = {}){
      let url = `https://gd-store.ge/api/Product/search`;
        
        // Prepare the query parameters
        let params = new URLSearchParams();
        
        if (title) params.append('title', title);
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        
        // If there are query parameters, append them to the URL
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();

            // Log the data to inspect the response
            console.log('API response:', data);
            
            // Check if the data contains a valid product array
            if (!Array.isArray(data) || data.length === 0) {
                console.warn('No products found or invalid product data.');
                return [];
            }

            // Check for undefined products and filter them out if necessary
            const validProducts = data.filter(product => product !== undefined);
            
            if (validProducts.length !== data.length) {
                console.warn('Some products were undefined and were skipped.');
            }
            
            return validProducts;

        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }


// 
// displayProducts function to display all the products adding pagination to it
// 
    async function displayProducts(maxProduct, page = 1){
      const products = await fetchProducts({title, category, minPrice, maxPrice});

      const pageCount = calculateMaxPageNumber(pagination, products);
      
      if(pageCount > 1){
        for(let i = 1; i <= pageCount; i++){
          document.querySelector('.pagination-wraper').innerHTML+= `<a href="shopping.html?title=${title}&page=${i}">${i}</a>`;
        }
      }        

      if(page*12 > products.length){
        maxProduct = products.length - (page - 1)*12;
      }

      console.log(maxProduct);
      for (let i = 0; i < maxProduct; i++) {
        let index = i + ((page - 1) * pagination);
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

        productDiv.innerHTML += HTMLbodyforProduct(product);
      }

      displayViewedProducts();

      addEventListenersToProducts(maxProduct, page, products);
      
    }


// 
// addEventListener function to adding click event listener to product wraper
// 
    function addEventListenersToProducts(maxProduct, page, products){
      for (let i = 0; i < maxProduct; i++) {
        let index = i + ((page - 1) * 12);
        let product = products[index];

        document.getElementById(`product${product.id}`)
          .addEventListener("click", () => {
            console.log(product.id);
            storeViewedProduct(product.id);
            window.location.href = `product.html?id=${product.id}`;
          });
      }
    }


// 
// html body for product wraper 
// 
    function HTMLbodyforProduct(product){
      return `<div id="product${product.id}" class="product-wraper">
              <div class="photo">
                  <img class="main-page-photo" src="https://gd-store.ge/${product.thumbnail}" alt="">
              </div>
              <h2 class="title">
                  ${product.title}
              </h2>
              <div class="price-rating">
                  <div class="rating">
                      <i class="fa-solid fa-star"></i>
                      <p></p>
                  </div>
                  <p class="price">
                      ${product.price}.00$
                  </p>
              </div>
          </div>`;
    }


// 
// display viewed Products function to get PRoducts what you just viewd
// 
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


// 
// storeviewedProducts to store product to localstorage when you click on them
// 
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


// 
// this function is for simply getting info from url
// 
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }


// 
// tu calculate maxPageNumber
// 
    function calculateMaxPageNumber(maxProductOnOnePage, products){
      return Math.ceil(products.length/maxProductOnOnePage);
    }


// 
// adding value in price input if there is any
// 
    function addValToPriceInput(){
      if(minPrice)
        document.getElementById('min').value = minPrice;

      if(maxPrice)
        document.getElementById('max').value = maxPrice;
    }


// 
// 
// 
// Adding EventListeners to buttons 
// 
// 

// 
// login button eventlistener
// 
    loginButton.addEventListener("click", () => {
      window.location.href = "loginPage.html";
    });

// 
// regisreation button eventlistener
// 
    registerButton.addEventListener("click", () => {
      window.location.href = "registrationPage.html";
    });


// 
// priceButton EventListsner
// 

    document.getElementById('price').addEventListener('click', ()=>{
      document.querySelector(".price-window").classList.toggle("hide");
    })


// 
// submit event listener to add price range
// 
    document.getElementById('price-form').addEventListener("submit", (event) => {
      event.preventDefault();
      const minVal = document.getElementById('min').value;
      const maxVal = document.getElementById('max').value;
      
      
      let baseUrl = window.location.href.split('?')[0]; 
      let currentParams = new URLSearchParams(window.location.search); 
      console.log(currentParams);

      if(getQueryParam('maxPrice') !== NaN && maxVal == 0){
        currentParams.delete('maxPrice');
      }
      else{
        if (maxVal) currentParams.set('maxPrice', maxVal); 
      }

      if(getQueryParam('minPrice') !== NaN && minVal == 0){
        currentParams.delete('minPrice');
      }
      else{
        if (minVal) currentParams.set('minPrice', minVal); 
      }
      
      
      let newUrl = baseUrl + '?' + currentParams.toString();
      
      window.location.href = newUrl;
    })


    
// 
// adding category filter
// 
    document.getElementById('category').addEventListener('change', function(event){
      const selectedCategory = event.target.value;

      let baseUrl = window.location.href.split('?')[0]; 
      let currentParams = new URLSearchParams(window.location.search); 

      if (selectedCategory !== "0") {
        currentParams.set('category', selectedCategory);
      } else {
          currentParams.delete('category'); 
      }

      let newUrl = baseUrl + '?' + currentParams.toString();

      window.location.href = newUrl;
    })


// 
// checking and chaning option value
// 
      window.addEventListener('DOMContentLoaded', (event) => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category'); // Get 'category' parameter from the URL
        
        if (category) {
            document.getElementById('category').value = category; // Set the dropdown value
        }
    });


// 
// event listener for search when press enter
// 
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('iconified').addEventListener('keydown', function(event) {
          // Check if the Enter key was pressed
          if (event.key === "Enter" || event.keyCode === 13) {
              const title = event.target.value;
              let baseUrl = window.location.href.split('?')[0]; 
              let currentParams = new URLSearchParams(window.location.search);

              // Redirect to shopping.html with the query
              if (title) {
                  currentParams.set('title', title);
                  window.location.href = baseUrl + '?' + currentParams.toString();
              } else {
                  currentParams.delete('title');
                  window.location.href = baseUrl + '?' + currentParams.toString(); // Default to show all products
              }
          }
      });
    });
// 
// event listener for responsive
// 
    window.addEventListener("resize", updateSearchDisplay);


// 
// 
// deploing all the functions 
// 
// 

// 
// to constanly update search bar at the top 
// 
    updateSearchDisplay();  


// 
// to check in localstorage if there is newly viewed product
// 
    checkForUser();


// 
//  adding values to price input 
// 
    addValToPriceInput();

// 
// tu display proucts
// 
    displayProducts(pagination,pageNumber);
