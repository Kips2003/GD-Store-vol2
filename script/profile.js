import { checkForUser, updateSearchDisplay, jwt_decode } from "./module.js";

// Utility functions
const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const extractDate = (dateString) => dateString.split('T')[0];

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const getUserId = () => {
    const user = getCookie('authToken');
    if (!user) {
        console.error('No auth token found');
        return null;
    }
    const decodedUser = jwt_decode(user);
    if (!decodedUser || !decodedUser.sub) {
        console.error('Unable to get user ID from token');
        return null;
    }
    return decodedUser.sub;
};

// API calls
const fetchUserByEmail = async (email) => {
    const url = `https://gd-store.ge/api/Auth/${email}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};

const fetchAddresses = async (userId) => {
    const url = `https://gd-store.ge/api/Address/byUserId/${userId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

const addNewAddress = async (addressData) => {

    try {
        const response = await fetch('https://gd-store.ge/api/Address', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressData)
        });
        if (!response.ok) throw new Error('Adding Address failed');
        return await response.json();
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
};

const deleteAddress = async (userId, addressId) => {
    const url = `https://gd-store.ge/api/Address/${userId}/${addressId}`;
    console.log('Sending DELETE request to:', url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`
            },
        });
        console.log('DELETE request response status:', response.status);
        const responseText = await response.text();
        console.log('DELETE request response text:', responseText);
        if (!response.ok) {
            throw new Error(`Deleting Address failed: ${response.status} ${responseText}`);
        }
        // Try to parse JSON, but handle cases where it's not JSON
        try {
            return responseText ? JSON.parse(responseText) : null;
        } catch (jsonError) {
            console.warn('Response is not JSON:', responseText);
            return responseText; // Return the raw text if it's not JSON
        }
    } catch (error) {
        console.error("Error in deleteAddress function:", error);
        throw error;
    }
};

// HTML generation functions
const generateProfileHTML = (user) => `
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

const generateAddressHTML = (addresses) => `
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

const generateAddressFormHTML = () => `
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

// UI manipulation functions
const animateSectionTransition = (sectionHTML) => {
    const start = document.getElementById('start');
    const end = document.getElementById('end');

    // Animation logic here

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

};
const loadUserInfo = async (email) => {
    const user = await fetchUserByEmail(email);
    if (user) {
        const profileHTML = generateProfileHTML(user);
        animateSectionTransition(profileHTML);
    }
};

const showAddressForm = () => {
    const main = document.querySelector('main');
    const formContainer = document.getElementById('address-add-form');
    
    formContainer.innerHTML = generateAddressFormHTML();
    formContainer.style.display = "block";
    main.style.filter = "blur(5px)";
    main.style.pointerEvents = "none";

    setupAddressFormEventListeners();
};

const closeAddressForm = () => {
    const main = document.querySelector('main');
    const formContainer = document.getElementById('address-add-form');

    main.style.filter = "none";
    main.style.pointerEvents = "auto";
    formContainer.innerHTML = "";
    formContainer.style.display = "none";
};

// Event handlers
const handleProfileClick = async (event) => {
    if (event.currentTarget.classList.contains('active')) return;
    removeActive();
    event.currentTarget.classList.add('active');
    const user = await fetchUserByEmail(getQueryParam('email'));
    animateSectionTransition(generateProfileHTML(user));
};

const handleAddressClick = async (event) => {
    if (event.currentTarget.classList.contains('active')) return;
    removeActive();
    event.currentTarget.classList.add('active');
    await loadAddressSection();
};

const loadAddressSection = async () => {
    const user = await fetchUserByEmail(getQueryParam('email'));
    const addresses = await fetchAddresses(user.id);
    const addressHTML = generateAddressHTML(addresses);
    animateSectionTransition(addressHTML);
    setupDynamicEventListeners();

}
const observeDOM = (callback) => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                callback();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
};

const domObserver = observeDOM(() => {
    setupDynamicEventListeners();
});
const handleAddressSubmit = async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(event.target);
        const userId = parseInt(getUserId());
        const addressData = {
            userId: userId,
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            postalCode: formData.get('zip'),
            country: formData.get('country')
        };

        await addNewAddress(addressData);
        closeAddressForm();
        // Refresh the entire address section instead of just updating the list
        await loadAddressSection();
    } catch (error) {
        alert("An error occurred while adding the address");
    }
};

// Setup functions
const setupEventListeners = () => {
    document.getElementById('profile').addEventListener('click', handleProfileClick);
    document.getElementById('address').addEventListener('click', handleAddressClick);
    // Add other menu item listeners here

    window.addEventListener("resize", updateSearchDisplay);
};

const setupDynamicEventListeners = () => {

    const addAddressButton = document.getElementById('addAddress');
    addAddressButton.addEventListener('click', showAddressForm);
    

    const currentAddresses = document.getElementById('currentAddresses');
    if (currentAddresses) {
        currentAddresses.removeEventListener('click', handleAddressesClick);
        currentAddresses.addEventListener('click', handleAddressesClick);
    } else {
        console.error('Current addresses container not found');
    }

}

const setupAddressFormEventListeners = () => {
    document.querySelector('.address-form-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('address-form-overlay')) closeAddressForm();
    });
    document.getElementById('closeForm').addEventListener('click', closeAddressForm);
    document.getElementById('newAddressForm').addEventListener('submit', handleAddressSubmit);
};

const removeActive = () => {
    ['profile', 'address', 'products', 'order', 'review'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
};

const handleAddressesClick = (event) => {
    const deleteButton = event.target.closest('.delete-address-btn');
    if (deleteButton) {
        handleDeleteAddress(event);
    } else {
        console.log('Click was not on a delete button');
    }
};

const handleDeleteAddress = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const deleteButton = event.target.closest('.delete-address-btn');
    if (!deleteButton) {
        console.error('Could not find delete button');
        return;
    }
    
    const addressId = deleteButton.dataset.addressId;
    const userId = getUserId();


    if (confirm('Are you sure you want to delete this address?')) {
        try {
            const result = await deleteAddress(userId, addressId);
            await loadAddressSection();
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete the address. Please try again.');
        }
    }
};

// Initialization
const initializeProfile = async () => {
    setupEventListeners();
    const email = getQueryParam('email');
    if (email) {
        await loadUserInfo(email);
    } else {
        // Handle case when no email is provided
        document.getElementById('start').innerHTML = '<h1>No user information available</h1>';
    }
    updateSearchDisplay();
    
    // 3. Add error handling for checkForUser
    try {
        checkForUser();
    } catch (error) {
        console.error("Error in checkForUser:", error);
    }
};

// Start the application
initializeProfile();