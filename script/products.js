
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

  

let logo = document.querySelector('.logo');
logo.style.cursosr = 'pointer';

logo.addEventListener('click', () => {
    window.location.href = "index.html";
});

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const sliderDiv = document.querySelector('.photo-slide');
const imageTrack = document.querySelector('.photos');

const dotDiv = document.querySelector('.dots');
let shift = 0;
const viewFinderSize = -(sliderDiv.clientWidth);

document.addEventListener('DOMContentLoaded', async () => {

    try{
        const response = await fetch(`https://gd-store.ge/api/Product/WithId/${productId}`);
        const data = await response.json();

        console.log(data);

/*
        this is the part where all the photos from the api will be brought to front end 
        i mean all of the and also they will be given the width and height which will be declared in css file
    */

        const images = [];
        


        data.images.forEach(element => {
            const imgTag = document.createElement('img');
            imgTag.src = `https://gd-store.ge/${element}`;
            imgTag.width = `${sliderDiv.clientWidth}`;
            imgTag.height = `${sliderDiv.clientHeight}`;

            images.push(imgTag);
            imageTrack.appendChild(imgTag);
        });

        imageTrack.style.width = `${images.length * sliderDiv.clientWidth}px`;
        imageTrack.style.height = `${sliderDiv.clientHeight}px`;

        let interval;

        /*
            from here is the part where the slide functionality comes in
            there will be automatic slides which will be in every 4 seconds
            there will be arrow which will have eventListeners to change photos from them
            and there will be a dots which helps the user to navigate
            also if the user changes the photo the timer will reset
        */
        
        //startAutoSlide();

        //lets add dots first and its functions

        for(let i = 0; i < images.length; i++){
            dotDiv.innerHTML += `<span class="dot" id="dot${i}"></span>`;
        }

        let dots = document.querySelectorAll('.dot');
        for(let i = 0; i < images.length; i++){
            document.getElementById(`dot${i}`).addEventListener('click', ()=>{
                shift = -(i * sliderDiv.clientWidth);

                dots.forEach((dot, i) => dot.classList.toggle('active', i === shift/(viewFinderSize)));
                imageTrack.style.transform = `translateX(${shift}px)`;
                //startAutoSlide();
            });
        }
        document.getElementById('dot0').classList.add('active');

        //we need a automatic slide function which will start as default and will added to every eventlistener



        function startAutoSlide(){
            clearInterval(interval);

            interval = setInterval(() => {
                shift -= sliderDiv.clientWidth;

                if(shift <= -(images.length * sliderDiv.clientWidth)){
                    shift = 0;
                }

                imageTrack.style.transform = `translate(${shift}px)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === shift/(viewFinderSize)));
            }, 4000);
        }



        //now its time for arrow eventlisteners(next and previous)

        //prev button

        document.querySelector('.prev').addEventListener('click', () => {
            shift += sliderDiv.clientWidth;

            if(shift > 0){
                shift = (images.length - 1) * -(sliderDiv.clientWidth);
            }
            dots.forEach((dot, i) => dot.classList.toggle('active', i === shift/(viewFinderSize)));
            imageTrack.style.transform = `translateX(${shift}px)`;
            //startAutoSlide();
        })

        //next button
        document.querySelector('.next').addEventListener('click', () => {
            shift -= sliderDiv.clientWidth;

            if(shift <= -(images.length * sliderDiv.clientWidth)){
                shift = 0;
            }
            dots.forEach((dot, i) => dot.classList.toggle('active', i === shift/(viewFinderSize)));
            imageTrack.style.transform = `translateX(${shift}px)`;
            //startAutoSlide();
        })


        // swipe functionality

        let startX = 0;
        let endX = 0;
        let isDragging = false;

        // Touch events for mobile devices
        imageTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        imageTrack.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        imageTrack.addEventListener('touchend', () => {
            handleSwipe();
            isDragging = false;
        });

        // Mouse events for desktop devices
        sliderDiv.addEventListener('mouseover', () => {
            document.querySelector('.prev').classList.toggle('onscreen');
            document.querySelector('.next').classList.toggle('onscreen');
        })
        sliderDiv.addEventListener('mouseout', () => {
            document.querySelector('.prev').classList.toggle('onscreen');
            document.querySelector('.next').classList.toggle('onscreen');
        })
        
        imageTrack.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                endX = e.clientX;
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                handleSwipe();
                isDragging = false;
            }
        });

            // Prevent default dragging for desktop
            imageTrack.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Common swipe handling function
        function handleSwipe() {
            const diffX = startX - endX;

            // Check if the swipe was significant enough to be considered a swipe
            if (Math.abs(diffX) > 50) { // 50px threshold for swipe detection
                if (diffX > 0) {
                    // Swipe left (next image)
                    shift -= sliderDiv.clientWidth;

                    if (shift <= -(images.length * sliderDiv.clientWidth)) {
                        shift = 0;
                    }
                } else {
                    // Swipe right (previous image)
                    shift += sliderDiv.clientWidth;

                    if (shift > 0) {
                        shift = (images.length - 1) * -(sliderDiv.clientWidth);
                    }
                }

                // Update slider position and dots
                imageTrack.style.transform = `translateX(${shift}px)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === shift / (viewFinderSize)));
                //startAutoSlide();
            }
        }


        //  adding title to the page

        const productTitle = document.querySelector('.top-title > h1');

        productTitle.innerHTML = `${data.title}`;


        //adding star rating and rating number to the page
    
            // Calculate the average rating
       // let reviews = data.Reviews;


        // function calculateAverageRating(reviews) {
        //     const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        //     return totalRating / reviews.length;
        // }

        // Function to update star colors
        // function updateStarRating(averageRating) {
        //     for (let i = 1; i <= 5; i++) {
        //         const star = document.getElementById(`star${i}`);
        //         if (i <= averageRating) {
        //             star.classList.remove('fa-regular');
        //             star.classList.add('fa-solid', 'fa-star');
        //             star.style.color = 'orangered';
        //         } else {
        //             star.classList.remove('fa-solid', 'fa-star');
        //             star.classList.add('fa-regular', 'fa-star');
        //             star.style.color = '#ccc'; 
        //         }
        //     }
        // }

        // // Calculate and update the stars
        // const averageRating = calculateAverageRating(reviews);
        // updateStarRating(averageRating);

        // adding float number of rating
        // document.querySelector('.rating-count').innerHTML = `<p>${averageRating.toFixed(1)}</p>`;



        // adding price and discount

        let priceDiv = document.querySelector('.price-discount');
        
        priceDiv.innerHTML = `<p class="price">${data.price}.00$</p>`;
        
        document.querySelector('.product-desc-num').innerHTML = `<div class="details-grid">
            <div class="detail-row">
                <div class="label">Weight</div>
                <div class="value">${data.weight}</div>
            </div>
            <div class="detail-row">
                <div class="label">Width</div>
                <div class="value">${data.width}</div>
            </div>
            <div class="detail-row">
                <div class="label">Depth</div>
                <div class="value">${data.depth}</div>
            </div>
            <div class="detail-row">
                <div class="label">Height</div>
                <div class="value">${data.height}</div>
            </div>
            </div>`;

        document.querySelector('.description').innerHTML += `<p>${data.description}</p>`;
 
    }
    catch(e){
        console.log(e);
    }
});
