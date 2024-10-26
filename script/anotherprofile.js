import { checkForUser, updateSearchDisplay, jwt_decode } from "./module.js";
import { getQueryParam, getUserId } from './utils.js';
import { fetchUserByEmail, fetchAddresses, addNewAddress, deleteAddress } from './api.js';
import { generateProfileHTML, generateAddressHTML, generateAddressFormHTML } from './htmlGenerators.js';

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
};

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

// Setup functions
const setupEventListeners = () => {
    document.getElementById('profile').addEventListener('click', handleProfileClick);
    document.getElementById('address').addEventListener('click', handleAddressClick);
    // Add other menu item listeners here

    window.addEventListener("resize", updateSearchDisplay);
};

const setupDynamicEventListeners = () => {

    const addAddressButton = document.getElementById('addAddress');
    if (addAddressButton) {
        addAddressButton.removeEventListener('click', showAddressForm); // Remove existing listener if any
        addAddressButton.addEventListener('click', showAddressForm);
    } else {
        console.warn('Add address button not found');
    }

    const currentAddresses = document.getElementById('currentAddresses');
    if (currentAddresses) {
        currentAddresses.removeEventListener('click', handleAddressesClick); // Remove existing listener if any
        currentAddresses.addEventListener('click', handleAddressesClick);
    } else {
        console.warn('Current addresses container not found');
    }


};

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

// Initialization
const initializeProfile = async () => {
    checkForUser();
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
    
    
};

// Start the application

console.log('starting application...')
initializeProfile();
