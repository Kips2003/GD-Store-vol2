import { getCookie } from './utils.js';

const API_BASE_URL = 'https://gd-store.ge/api';

export const fetchUserByEmail = async (email) => {
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

export const fetchAddresses = async (userId) => {
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

export const addNewAddress = async (addressData) => {

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

export const deleteAddress = async (userId, addressId) => {
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


export async function fetchProductById(id) {
    let url = `https://gd-store.ge/api/Product/WithId/${id}`;

    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        console.log("API response: ", data);

        // Check if the data contains a valid product array

        // Check for undefined products and filter them out if necessary
        


        return data;
    }
    catch(error){
        console.error(`Fetch error:`, error);
        return [];
    }
}

export async function fetchReviewsFromApi(productId){
    const url = `https://gd-store.ge/api/Reviews/product/${productId}`;

    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error('Error while fetching reviews');
        }

        const data = response.json();
    
        return data;
    }
    catch(error){
        console.error('Error:', error);
        return [];
    }

}

export async function fetchUser(id) {
    const url = `https://gd-store.ge/api/Auth/WithId/${id}`;

    try{
        const response = await fetch(url);

        if(!response.ok)
            throw new Error('Error while fetching user');

        const data = response.json();

        return data;
    }
    catch(error){
        console.error('Error', error);
        return '';
    }
}