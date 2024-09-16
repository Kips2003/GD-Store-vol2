const loginButton = document.querySelector('.log-in');
const registerButton = document.querySelector('.sign-in');
const secTwoH2 = document.querySelector('.sec-two-wraper h2');
const secTwoP = document.querySelector('.sec-two-wraper p');
const secTwo = document.querySelector('.sec-two-wraper');

loginButton.style.cursor = "pointer";
registerButton.style.cursor = "pointer";



let alreadyAnimated = false;

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05,
}
let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !alreadyAnimated) {
            secTwo.classList.add('animate'); // Add the class to trigger animation
            alreadyAnimated = true; // Prevent re-triggering the animation
            observer.unobserve(secTwo); // Stop observing after animation
        }
    });
}, options);

observer.observe(secTwo);


const shopNowButton = document.querySelector('.shop-now');
shopNowButton.style.cursor = "pointer";

shopNowButton.addEventListener('click', () => {
    window.location.href = 'shopping.html';
})

