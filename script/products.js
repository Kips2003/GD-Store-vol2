// Imports
import { updateSearchDisplay, handleMobileSearchClick, checkForUser, getUserFromToken } from "./module.js";
import { getQueryParam } from "./utils.js";
import { fetchProductById, fetchReviewsFromApi, fetchUser } from "./api.js";
import { ReviewHTML } from "./htmlGenerators.js";

// Constants
const API_BASE_URL = 'https://gd-store.ge/api';

// DOM Elements
const loginButton = document.querySelector(".log-in");
const registerButton = document.querySelector(".sign-in");
const logo = document.querySelector('.logo');
const sliderDiv = document.querySelector('.photo-slide');
const imageTrack = document.querySelector('.photos');
const dotDiv = document.querySelector('.dots');
const addCartButton = document.getElementById('addCart');
const productId = getQueryParam('id');

// Global Variables
let shift = 0;
const viewFinderSize = -(sliderDiv.clientWidth);

window.addEventListener('DOMContentLoaded', async () => {
    await updateSearchDisplay(); // Call this first
    await initializePage();
    await addReviewsToProductPage();
});

// Event Handlers
function setupEventListeners() {
    loginButton.addEventListener("click", () => {
        window.location.href = "loginPage.html";
    });

    registerButton.addEventListener("click", () => {
        window.location.href = "registrationPage.html";
    });

    logo.addEventListener('click', () => {
        window.location.href = "index.html";
    });

    // document.addEventListener('keydown', (event) => {
    //     if (event.target.id === 'iconified') {
    //         handleSearchKeydown(event);
    //     }
    // });
    addCartButton.addEventListener('click', addToCart);

    document.getElementById('addReview').addEventListener('click', () => {
        window.location.href = `addReview.html?id=${getQueryParam('id')}`;
    });

    window.addEventListener("resize", async () => {
        await updateSearchDisplay();
    });
}

function handleSearchKeydown(event) {
    // Check if the Enter key was pressed
    if (event.key === "Enter" || event.keyCode === 13) {
        const title = event.target.value;
  
        // Redirect to shopping.html with the query
        if (title) {
            window.location.href = `shopping.html?limit=10&title=${encodeURIComponent(title)}`;
        } else {
            window.location.href = 'shopping.html?limit=10'; // Default to show all products
        }
    }
}


async function initializePage() {
    loginButton.style.cursor = "pointer";
    registerButton.style.cursor = "pointer";
    logo.style.cursor = 'pointer';
    addCartButton.style.cursor = 'pointer';
    document.getElementById('addReview').style.cursor = 'pointer';
    
    const quantityDefaultValue = document.getElementById('quantity');
    quantityDefaultValue.value = 1;
    
    checkForUser();
    setupEventListeners();
    await displayProductPage();
    
}


async function displayProductPage() {
    const data = await fetchProductById(productId);
    console.log(data);

    const images = createProductImages(data.images);
    setupNavigationDots(images);
    setupSlideControls(images);
    setupSwipeFunction(images);
    displayProductDetails(data);
}

function createProductImages(imageUrls) {
    const images = [];
    imageUrls.forEach(url => {
        const imgTag = document.createElement('img');
        imgTag.src = `https://gd-store.ge/${url}`;
        imgTag.width = sliderDiv.clientWidth;
        imgTag.height = sliderDiv.clientHeight;
        images.push(imgTag);
        imageTrack.appendChild(imgTag);
    });
    imageTrack.style.width = `${images.length * sliderDiv.clientWidth}px`;
    imageTrack.style.height = `${sliderDiv.clientHeight}px`;
    return images;
}

function setupNavigationDots(images) {
    for (let i = 0; i < images.length; i++) {
        dotDiv.innerHTML += `<span class="dot" id="dot${i}"></span>`;
    }

    let dots = document.querySelectorAll('.dot');
    for (let i = 0; i < images.length; i++) {
        document.getElementById(`dot${i}`).addEventListener('click', () => {
            shift = -(i * sliderDiv.clientWidth);
            updateSliderPosition(dots);
        });
    }
    document.getElementById('dot0').classList.add('active');
}

function setupSlideControls(images) {
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    prevButton.style.transform = `translateX(5px) translateY(-${sliderDiv.clientHeight / 2}px)`;
    nextButton.style.transform = `translateX(${sliderDiv.clientWidth - 45}px) translateY(-${sliderDiv.clientHeight / 2}px)`;

    prevButton.addEventListener('click', () => handleSlideChange(images, 1));
    nextButton.addEventListener('click', () => handleSlideChange(images, -1));

    setupHoverEffects();
}

function handleSlideChange(images, direction) {
    shift += direction * sliderDiv.clientWidth;
    if (shift > 0) {
        shift = (images.length - 1) * -(sliderDiv.clientWidth);
    } else if (shift <= -(images.length * sliderDiv.clientWidth)) {
        shift = 0;
    }
    updateSliderPosition(document.querySelectorAll('.dot'));
}

function updateSliderPosition(dots) {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === shift / (viewFinderSize)));
    imageTrack.style.transform = `translateX(${shift}px)`;
}

function setupHoverEffects() {
    sliderDiv.addEventListener('mouseover', toggleArrowVisibility);
    sliderDiv.addEventListener('mouseout', toggleArrowVisibility);
}

function toggleArrowVisibility(show) {
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');
    if (show) {
        prevArrow.classList.add('onscreen');
        nextArrow.classList.add('onscreen');
    } else {
        prevArrow.classList.remove('onscreen');
        nextArrow.classList.remove('onscreen');
    }
}


function setupSwipeFunction(images) {
    let startX = 0;
    let endX = 0;
    let isDragging = false;

    const touchEvents = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
    };

    const mouseEvents = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    };

    setupSwipeListeners(touchEvents, (e) => e.touches[0].clientX);
    setupSwipeListeners(mouseEvents, (e) => e.clientX);

    imageTrack.addEventListener('dragstart', (e) => e.preventDefault());

    function setupSwipeListeners(events, getClientX) {
        imageTrack.addEventListener(events.start, (e) => {
            startX = getClientX(e);
            isDragging = true;
        });

        const moveTarget = events.move === 'mousemove' ? window : imageTrack;
        moveTarget.addEventListener(events.move, (e) => {
            if (isDragging) {
                endX = getClientX(e);
            }
        });

        window.addEventListener(events.end, () => {
            if (isDragging) {
                handleSwipe(images,startX, endX);
                isDragging = false;
            }
        });
    }
}


function handleSwipe(images, startX, endX) {
    const diffX = startX - endX;
    if (Math.abs(diffX) > 50) {
        handleSlideChange(images, diffX > 0 ? -1 : 1);
    }
}


function displayProductDetails(data) {
    document.querySelector('.top-title > h1').innerHTML = data.title;
    document.querySelector('.price-discount').innerHTML = `<p class="price">${data.price}.00$</p>`;
    document.querySelector('.product-desc-num').innerHTML = generateProductDetailsHTML(data);
    document.querySelector('.description').innerHTML += `<p>${data.description}</p>`;
}

function generateProductDetailsHTML(data) {
    const details = [
        { label: 'Weight', value: data.weight },
        { label: 'Width', value: data.width },
        { label: 'Depth', value: data.depth },
        { label: 'Height', value: data.height }
    ];

    return `
        <div class="details-grid">
            ${details.map(detail => `
                <div class="detail-row">
                    <div class="label">${detail.label}</div>
                    <div class="value">${detail.value}</div>
                </div>
            `).join('')}
        </div>`;
}

async function addReviewsToProductPage(){
    const reviews = await fetchReviewsFromApi(productId);

    for(let i = 0; i < reviews.length; i++){
        let review = reviews[i];
        let user = await fetchUser(review.userId)
        let html = await ReviewHTML(review, user);
        document.getElementById('allReviews').innerHTML += html;
    }


}

async function GetQuantityValue() {
    const quantity = document.getElementById('quantity').value;

    // Check if the quantity is a valid number and greater than 0
    if (quantity === '' || isNaN(quantity) || parseInt(quantity) <= 0) {
        return null;
    }

    return quantity;
}

async function addToCart() {
    let userDecode = await getUserFromToken();
    console.log(userDecode);

    const quantity = await GetQuantityValue();
    console.log(quantity);

    // Check if quantity is valid
    if (quantity === null) {
        alert('Need to enter a valid quantity greater than 0');
        return;
    }

    const cartItems = {
        productId: parseInt(productId),
        quantity: parseInt(quantity)
    }

    const addToCartRequest = {
        userId: userDecode.sub,
        cartItems: [cartItems]
    }

    console.log(JSON.stringify(addToCartRequest));

    try {
        const response = await fetch('https://gd-store.ge/api/Cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addToCartRequest)
        });

        if (!response.ok) {
            throw new Error('Adding to cart failed');
        }

    }
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}












