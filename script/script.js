// let section = document.querySelector("section");
// section.style.height = document.height-110;


// const loginButton = document.querySelector('.log-in');
// const registerButton = document.querySelector('.sign-in');
// const secTwoH2 = document.querySelector('.sec-two-wraper h2');
// const secTwoP = document.querySelector('.sec-two-wraper p');
// const secTwo = document.querySelector('.sec-two-wraper');
// const secThree = document.querySelector('.sec-three');

// loginButton.style.cursor = "pointer";
// registerButton.style.cursor = "pointer";



// let alreadyAnimated = false;

// const options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.05,
// }
// let observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting && !alreadyAnimated) {
//             secTwo.classList.add('animate'); // Add the class to trigger animation
//             alreadyAnimated = true; // Prevent re-triggering the animation
//             observer.unobserve(secTwo); // Stop observing after animation
//         }
//     });
// }, options);

// observer.observe(secTwo);

// observer.observe(secThree);


// const shopNowButton = document.querySelector('.shop-now');
// shopNowButton.style.cursor = "pointer";

// shopNowButton.addEventListener('click', () => {
//     window.location.href = 'shopping.html';
// })



// function scrollToSection(event, sectionId) {
//     event.preventDefault();
//     const section = document.querySelector(sectionId);
//     const offset = -110;
//     const bodyRect = document.body.getBoundingClientRect().top;
//     const sectionRect = section.getBoundingClientRect().top;
//     const sectionPosition = sectionRect - bodyRect;
//     const offsetPosition = sectionPosition + offset;

//     window.scrollTo({
//         top: offsetPosition,
//         behavior: 'smooth'
//     });
// }
// const shopLinks = document.querySelectorAll('.click-shop');
// shopLinks.forEach(link => {
//     link.addEventListener('click', function(event) {
//         event.preventDefault();
//         const targetId = this.dataset.target;
//         document.getElementById(targetId).style.padding = '30px';
//         setTimeout(() =>{
//             document.getElementById(targetId).style.padding = '20px';
//         },150);
        
//     });
// });

// const search = document.querySelector('.search');

// // Function to check the width and update the display property
// function updateSearchDisplay() {
//     const documentWidth = document.documentElement.clientWidth;
//     const main = document.querySelector('main');
//     const mainHTML = main.innerHTML;

//     if (documentWidth < 720) {
//         document.querySelector('.sign-log').appendChild(search);
//         search.style.order = '0';
//         search.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
//         search.style.cursor = "pointer";
        
//         search.addEventListener('click',() => {
//             main.innerHTML = `<section class="search-main">
//                                 <input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   S e a r c h"/>
//                             </section> ${mainHTML}`;
//         })
//     } else {
//         document.querySelector('.wraper').appendChild(search);
//         search.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   S e a r c h"/>`;
//         search.style.order = '2';
//         document.querySelector('.search-main').style.display = "none";
//     }
// }

// // Run the function on page load
// updateSearchDisplay();

// // Add the event listener for window resize
// window.addEventListener('resize', updateSearchDisplay);






// Select necessary elements
const search = document.querySelector('.search');
const secTwo = document.querySelector('.sec-two-wraper');
const secThree = document.querySelector('.sec-three-wraper');

// Function to check the width and update the display property for search
function updateSearchDisplay() {
    const documentWidth = document.documentElement.clientWidth;

    if (documentWidth < 720) {
        // Move the search bar into a different container on small screens
        document.querySelector('.sign-log').appendChild(search);
        search.style.order = '0';
        search.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
        search.style.cursor = "pointer";
        
        // Add click event to display the search input
        search.addEventListener('click', () => {
            let searchSection = document.querySelector('.search-main');
            if (searchSection) {
                // If search section exists, toggle its visibility
                if (searchSection.style.display === 'none' /*|| searchSection.style.display === ''*/) {
                    searchSection.style.display = 'block'; // Make sure it's visible
                } else {
                    searchSection.style.display = 'none'; // Hide it again on subsequent clicks
                }
            } else {
                // If search section doesn't exist, create and append it at the top of the main element
                const searchMain = document.createElement('section');
                searchMain.classList.add('search-main');
                searchMain.innerHTML = `
                    <input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   Search"/>
                `;
                searchMain.style.padding = '10px'; // Add some padding to make it noticeable
                searchMain.style.backgroundColor = '#fff8f2'; // Ensure background is visible
                searchMain.style.position = 'fixed'; // So it shows in flow of the page
                searchMain.style.zIndex = '12'; // Keep it above other content

                // Insert the searchMain element as the first child of the main element
                document.querySelector('main').insertBefore(searchMain, document.querySelector('main').firstChild);
            }
        });
    } else {
        // Move the search bar back and restore its appearance on larger screens
        document.querySelector('.wraper').appendChild(search);
        search.innerHTML = `<input type="text" class="form-control empty" id="iconified" placeholder="&#xF002;   S e a r c h"/>`;
        search.style.order = '2';
        const searchSection = document.querySelector('.search-main');
        searchSection.style.display = "none";
        if (searchSection) {
            searchSection.style.display = 'none'; // Hide the extra search section on larger screens
        }
    }
}

// Run the function on page load
updateSearchDisplay();

// Add the event listener for window resize to update the search bar display dynamically
window.addEventListener('resize', updateSearchDisplay);

// IntersectionObserver to animate secTwo when it becomes visible on scroll
let alreadyAnimated = false;

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05,
};

let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !alreadyAnimated) {
            secTwo.classList.add('animate'); // Trigger animation class for secTwo
            alreadyAnimated = true; // Prevent the animation from triggering multiple times
            observer.unobserve(secTwo); // Stop observing secTwo after it animates
        }
    });
}, options);

observer.observe(secTwo);


alreadyAnimated = false;

let observerThree = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !alreadyAnimated) {
            secThree.classList.add('animate'); // Trigger animation class for secTwo
            alreadyAnimated = true; // Prevent the animation from triggering multiple times
            observer.unobserve(secThree); // Stop observing secTwo after it animates
        }
    });
}, options);

observerThree.observe(secThree); // Observe secThree for animation as well

// Set the cursor style for the login and register buttons
const loginButton = document.querySelector('.log-in');
const registerButton = document.querySelector('.sign-in');
loginButton.style.cursor = "pointer";
registerButton.style.cursor = "pointer";

// Handle "Shop Now" button click
const shopNowButton = document.querySelector('.shop-now');
shopNowButton.style.cursor = "pointer";

shopNowButton.addEventListener('click', () => {
    window.location.href = 'shopping.html';
});

// Smooth scroll to section logic when clicking shop links
function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.querySelector(sectionId);
    const offset = -110; // Adjust this to your header height
    const bodyRect = document.body.getBoundingClientRect().top;
    const sectionRect = section.getBoundingClientRect().top;
    const sectionPosition = sectionRect - bodyRect;
    const offsetPosition = sectionPosition + offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Handle smooth scrolling for elements with the class "click-shop"
const shopLinks = document.querySelectorAll('.click-shop');
shopLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.dataset.target;
        document.getElementById(targetId).style.padding = '30px';
        setTimeout(() => {
            document.getElementById(targetId).style.padding = '20px'; // Restore original padding after a short delay
        }, 150);
    });
});
