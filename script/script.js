let section = document.querySelector("section");
section.style.height = document.height-110;


const loginButton = document.querySelector('.log-in');
const registerButton = document.querySelector('.sign-in');
const secTwoH2 = document.querySelector('.sec-two-wraper h2');
const secTwoP = document.querySelector('.sec-two-wraper p');
const secTwo = document.querySelector('.sec-two-wraper');
const secThhree = document.querySelector('.sec-three');

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

observer.observe(secThree);


const shopNowButton = document.querySelector('.shop-now');
shopNowButton.style.cursor = "pointer";

shopNowButton.addEventListener('click', () => {
    window.location.href = 'shopping.html';
})



function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.querySelector(sectionId);
    const offset = -110;
    const bodyRect = document.body.getBoundingClientRect().top;
    const sectionRect = section.getBoundingClientRect().top;
    const sectionPosition = sectionRect - bodyRect;
    const offsetPosition = sectionPosition + offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}
const shopLinks = document.querySelectorAll('.click-shop');
shopLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.dataset.target;
        document.getElementById(targetId).style.padding = '30px';
        setTimeout(() =>{
            document.getElementById(targetId).style.padding = '20px';
        },150);
        
    });
});