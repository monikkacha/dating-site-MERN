import { Base64 } from 'js-base64';

export function setToken(token) {
    localStorage.setItem('jwt', token);
}

export function getToken() {
    return localStorage.jwt;
}

export function removeToken() {
    localStorage.removeItem('jwt');
}

export function isAuthenticated() {
    return typeof localStorage.jwt !== 'undefined' && localStorage.jwt.length > 0;
}

export function getUserDetails() {
    if (!isAuthenticated()) {
        return null;
    }

    const token = getToken();

    let tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return null;
    }

    return JSON.parse(Base64.decode(tokenParts[1]));
}

export function isAllowedRole(roles, details) {
    console.log(roles)
    return roles.some((role) => !!details && !!details.privileges && details.privileges[role])
}