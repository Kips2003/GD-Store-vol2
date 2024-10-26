import { extractDate } from './utils.js';

export const generateProfileHTML = (user) => `
    <h1>Profile info:</h1>
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
    </form>
`;

export const generateAddressHTML = (addresses) => `
    <h1>Addresses:</h1>
    <div class="current-addresses" id="currentAddresses">
        ${addresses.map(address => `
            <div class="single-address" data-address-id="${address.id}">
                <p>Street: <span>${address.street}</span></p>
                <p>City: <span>${address.city}</span></p>
                <p>State: <span>${address.state}</span></p>
                <p>Postal Code: <span>${address.postalCode}</span></p>
                <p>Country: <span>${address.country}</span></p>
                <button class="delete-address-btn" data-address-id="${address.id}">DELETE</button>
            </div>
        `).join('')}
    </div>
    <div class="add-address" style="cursor: pointer">
        <div id="addAddress">
            <p>Add Address</p>
            <i class="fa-solid fa-circle-plus fa-beat-fade"></i>
        </div>
    </div>
`;

export const generateAddressFormHTML = () => `
    <div class="address-form-overlay">
        <button id="closeForm" class="close-btn">X</button>
        <div class="address-form-container">
            <h2>Add a New Address</h2>
            <form id="newAddressForm">
                <label for="street">Street:</label>
                <input type="text" id="street" name="street" required>
                <br></br>

                <label for="city">City:</label>
                <input type="text" id="city" name="city" required>
                <br></br>

                <label for="state">State:</label>
                <input type="text" id="state" name="state" required>
                <br></br>

                <label for="zip">ZIP Code:</label>
                <input type="text" id="zip" name="zip" required>
                <br></br>

                <label for="country">Country:</label>
                <input type="text" id="country" name="country" required>
                <br></br>    

                <button type="submit">Save Address</button>
            </form>
        </div>
    </div>
`;

export async function ReviewHTML(review, user){
    return `<div class="review">
                <div class="user-full">
                    <div class="user">
                        <img src="https://gd-store.ge/${user.profilePicture}" alt="">
                    </div>
                    <p>${user.userName}</p>
                </div>

                <div class="review-info">
                    <p>${review.comment}</p>
                    <div class="all-pictures">
                        <div class="pictures" style="background-image: url(https://gd-store.ge/${review.images[0]});">
                            
                        </div>
                        <div class="other-pictures" style="background-image:  linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url(https://gd-store.ge/${review.images[1]});">
                            <p>+${review.images.length}</p>  
                        </div>
                    </div>
                </div>
            </div>`;
}
