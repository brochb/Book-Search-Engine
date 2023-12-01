// utils/auth.js
const Auth = {
    // Example method for logging in and obtaining a JWT
    async login(email, password) {
        try {
            // Perform authentication request to your server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            // Assuming the server responds with a token
            const { token } = await response.json();

            // Store the token in localStorage or a secure storage method
            localStorage.setItem('jwt', token);

            // Return true to indicate a successful login
            return true;
        } catch (error) {
            // Handle errors (e.g., network issues, invalid credentials)
            console.error('Login error:', error.message);
            return false;
        }
    },

    // Example method for logging out and removing the JWT
    logout() {
        // Remove the token from localStorage or the storage method you used
        localStorage.removeItem('jwt');

        // Return true to indicate a successful logout
        return true;
    },

    // Example method to check if the user is authenticated based on the presence of a JWT
    checkAuthentication() {
        // Check if the token is present in localStorage or your storage method
        const token = localStorage.getItem('jwt');

        // Return true if the token is present, indicating the user is authenticated
        return !!token;
    },

    // Example method to get the JWT for making authenticated requests
    getAuthToken() {
        // Get the token from localStorage or your storage method
        return localStorage.getItem('jwt');
    },
};

export default Auth;
