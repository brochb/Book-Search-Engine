export const getMeQuery = (token) => {
    return fetch('/api/users/me', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
};

export const searchGoogleBooksQuery = (query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
