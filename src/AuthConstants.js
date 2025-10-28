export const DEFAULT_CREDENTIALS = {
    username: 'darshan',
    password: 'passsword123'
};

export const STORAGE_KEYS = {
    CURRENT_USER: 'hyperlocal_user',
    USERS: 'hyperlocal_users'
};

export const authUtils = {
    isAuthenticated: () => {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user).isLoggedIn : false;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    userExists: (username) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        return users.some(user => user.username === username);
    }
};