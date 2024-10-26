import { jwt_decode } from "./module.js";

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const extractDate = (dateString) => dateString.split('T')[0];

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

export const getUserId = () => {
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