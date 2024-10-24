import { checkForUser } from "./module.js";
import { updateSearchDisplay } from "./module.js";


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

const email = getQueryParam('email');

const profile = document.getElementById('profile')
const address = document.getElementById('address');
const products = document.getElementById('products');
const order = document.getElementById('order');
const review = document.getElementById('review');

function animateSectionTransition(sectionHTML){

    const start = document.getElementById('start');
    const end = document.getElementById('end');

    end.style.display = 'block';
    end.innerHTML = sectionHTML;

    start.style.opacity = '0';
    start.style.transform = "translateX(-100%)";


    setTimeout(() => {
        end.style.opacity = '1';
        end.style.transform = `translateX(0%)`;
        start.style.display = 'none';
    },500);


    setTimeout(() => {
        start.innerHTML = sectionHTML;
        start.style.transform = 'translateX(0%)';
        start.style.display = 'block';
        start.style.opacity = '1';

        end.style.opacity = '0';
        end.style.transform = "translateX(100%)";
        end.style.display = 'none';
        end.innerHTML = '';
    },1000)

}
profile.addEventListener('click', async (event) => {
    if(event.currentTarget.classList.contains('active')){
        return;
    }
    removeActive();
    event.currentTarget.classList.add('active');
    animateSectionTransition(await profileHTML());
    // await loadUserInfo();
})

address.addEventListener('click', async (event) => {
    if(event.currentTarget.classList.contains('active')){
        return;
    }
    removeActive();
    event.currentTarget.classList.add('active');
    animateSectionTransition(await addressHTML());
    await loadEventListenerForAddress();
})

async function loadEventListenerForAddress() {
    const addAddressBtn = document.getElementById('addAddress');
    
    // Ensure the element exists before attaching the event listener
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', async () => {
            await showAddressForm();
        });
        addAddressBtn.style.cursor = "pointer";
    } else {
        console.error('Element with id "addAddress" not found.');
    }
}

export function showAddressForm(){
    const body = document.querySelector('body');

    body.style.filter = "blur(5px)";
    body.style.pointerEvents = "none";
}

function ordersHTML(){

}
function productsHTML(){

}
function reviewsHTML(){

}
async function addressHTML(){
    return `<h1>Addresses: </h1>
            <div class="current-addresses" id="currentAddresses">
                ${await loadAddresses()}
            </div>
            <div class="add-address" style="cursor: pointer" onclick=showAddressForm()>
                <div id="addAddress">
                    <p>Add Address</p>
                    <i class="fa-solid fa-circle-plus fa-beat-fade"></i>
                </div>
            </div>`;
}
async function profileHTML(){
    const user = await getUserByEmail();
    const result = ` <h1>Profile info:</h1>
                <form id="profile-update">
                    <div class="form-wraper">
                        <div class="name">
                            <div class="first-name">
                                <label for="firstName">First Name: </label>
                                <br>
                                <input type="text" name="firstName" id="firstName" value='${user.firstName}'>
                            </div>
                            <div class="last-name">
                                <label for="lastName">Last Name:</label>
                                <br>
                                <input type="text" name="lastName" id="lastName" value='${user.lastName}'>
                            </div>
                        </div>
                        <div class="user-name">
                            <div class="username">
                                <label for="userName">User Name:</label>
                                <br>
                                <input type="text" name="userName" id="userName" value='${user.userName}'>
                            </div>
                            <div class="phonenumber">
                                <label for="phoneNumber">Phone Number:</label>
                                <br>
                                <input type="text" name="phoneNumber" id="phoneNumber" value='${user.phoneNumber}'>
                            </div>
                        </div>
                        <div class="dates">
                            <div class="date-birth">
                                <label for="dateBirth">Date of Birth: </label>
                                <br>
                                <input type="date" name="dateBirth" id="dateBirth" value='${extractDate(user.dateOfBirth)}'>
                            </div>
                            <div class="date-create">
                                <label for="dateCreate">Date of Create: </label>
                                <br>
                                <input type="date" name="dateCreate" id="dateCreate" value='${extractDate(user.dateOfCreate)}'>
                            </div>
                        </div>
                        <div class="email-pas">
                            <div class="email">
                                <label for="email">Email:</label>
                                <br>
                                <input type="text" name="email" id="email" value='${user.email}'>
                            </div>
                            <div class="pas">
                                <p>Change Password  &#10095;</p>
                            </div>
                        </div>
                        <button class="submit-button" type="submit">Save</button>
                    </div>
                </form>`;

            return result;
}

async function getUserByEmail(){
    const url = `https://gd-store.ge/api/Auth/${email}`;

    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();

        return data;
    }
    catch(error){
        console.error(`Fetch error`, error);
        return '';
    }
}

async function fetchAddresses(id) {
    const url = `https://gd-store.ge/api/Address/byUserId/${id}`;

    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return data;
    }
    catch(error){
        console.error(`Fetch error`, error);
        return [];
    }
}
// const address = {
//     street: "sazonis 16a, 25",
//     city: "Tbilisi",
//     state: "Tbilisi",
//     postalCode: "0178",
//     country: "Georgia"
// };

async function loadAddresses(){
    const user = await getUserByEmail();
    const addresses = await fetchAddresses(user.id);
    let result = ``;

    for (let i = 0; i < addresses.length; i++){
       let address = addresses[i];
        
        result += 
            `<div class="single-address">
                <p>Street:   <span>${address.street}</span></p>
                <p>City:   <span>${address.city}</span></p>
                <p>State:   <span>${address.state}</span></p>
                <p>Postal Code:   <span>${address.postalCode}</span></p>
                <p>Country:   <span>${address.country}</span></p>

                <div>
                    <i class="fa-solid fa-trash-can"></i>
                </div>
            </div>`;

    }

    return result;
}

async function loadUserInfo(){
    const user = await getUserByEmail();
    console.log(user);

    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('userName').value = user.userName;
    document.getElementById('phoneNumber').value = user.phoneNumber;
    document.getElementById('dateBirth').value = extractDate(user.dateOfBirth);
    document.getElementById('dateCreate').value = extractDate(user.dateOfCreate);
    document.getElementById('email').value = user.email;
}

function removeActive(){
    profile.classList.remove('active');
    address.classList.remove('active');
    products.classList.remove('active');
    order.classList.remove('active');
    review.classList.remove('active');
}


function extractDate(dateString) {
    // Split the ISO string at 'T' and return the first part (date)
    return dateString.split('T')[0];
}





await loadUserInfo();



updateSearchDisplay();  
window.addEventListener("resize", updateSearchDisplay);
checkForUser();