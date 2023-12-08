const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')

const app = express();
const port = 3000; // Set your desired port

app.use(express.json());

app.use(bodyParser.json());

const registeredUsers = [
    {
        "username": "test",
        "password": "test123"
    }
];

// Mock data for testing purposes
const books = [
    { id: 1, title: 'Book 1', author: 'Author 1', isbn: '1234567890' },
    { id: 2, title: 'Book 2', author: 'Author 2', isbn: '0987654321' },
    { id: 3, title: 'Book 3', author: 'Author 3', isbn: '1234567810' },
    { id: 4, title: 'Book 4', author: 'Author 4', isbn: '1234567820' },
    { id: 5, title: 'Book 5', author: 'Author 5', isbn: '1234567830' },
    // Add more books as needed
];

const reviews = [
    { bookId: 1, review: 'Great book!',isbn: '1234567890' },
    { bookId: 2, review: 'Awesome read!', isbn: '0987654321' },
    { bookId: 3, review: 'Great book!', isbn: '1234567810' },
    { bookId: 4, review: 'Great book!', isbn: '1234567820' },
    { bookId: 5, review: 'Great book!', isbn: '1234567830' },
    // Add more reviews as needed
];

app.get('/books', (req, res) => {
    res.json(books);
});


// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find((b) => b.isbn === isbn);
    res.json(book || {});
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = books.filter((b) => b.author === author);
    res.json(booksByAuthor);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = books.filter((b) => b.title.includes(title));
    res.json(booksByTitle);
});

// Task 5: Get book Review
app.get('/reviews/book/:bookId', (req, res) => {
    const { bookId } = req.params;
    const review = reviews.find((r) => r.bookId === parseInt(bookId, 10));
    res.json(review || {});
});

// Task 6: Register new user

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Simulate user registration process (in a real app, you'd interact with a database)
        const newUser = { username, password };
        registeredUsers.push(newUser);

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Task 7: Endpoint to login a user
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Simulate user authentication (in a real app, you'd interact with a database)
        const user = registeredUsers.find((u) => u.username === username && u.password === password);

        if (user) {
            res.json({ message: 'User logged in successfully', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: Missing credentials' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Check if the user exists and the password is correct (replace with proper authentication logic)
    const authenticatedUser = registeredUsers.find(
        (user) => user.username === username && user.password === password
    );

    if (authenticatedUser) {
        req.user = authenticatedUser;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
    }
};


// Task 8: Endpoint to add or modify a book review
app.post('/books/reviews', authenticateUser, (req, res) => {
    try {
        const { isbn, review } = req.body;

        // Check if the book exists
        const existingBook = books.find((book) => book.isbn === isbn);

        if (existingBook) {
            // If the book exists, update the review
            const existingReview = reviews.find(
                (r) => r.isbn === isbn && r.userId === req.user.id
            );

            if (existingReview) {
                existingReview.review = review;
                res.json({ message: 'Review updated successfully', review: existingReview });
            } else {
                // If the user hasn't reviewed this book before, add a new review
                const newReview = { isbn, userId: req.user.id, review };
                reviews.push(newReview);
                res.status(201).json({ message: 'Review added successfully', review: newReview });
            }
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 9: Endpoint to delete a book review added by the authenticated user
app.delete('/books/reviews/:isbn', authenticateUser, (req, res) => {
    try {
        const { isbn } = req.params;

        // Check if the book exists
        const existingBook = books.find((book) => book.isbn === isbn);

        if (existingBook) {
            // Find and delete the review added by the authenticated user
            const index = reviews.findIndex(
                (review) => review.isbn === isbn
            );

            if (index !== -1) {
                const deletedReview = reviews.splice(index, 1)[0];
                res.json({ message: 'Review deleted successfully', review: deletedReview });
            } else {
                res.status(404).json({ error: 'Review not found' });
            }
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 10: async await to get books
app.get('/books', async (req, res) => {
    try {
        // Assuming there's an external API providing book data
        const response = await axios.get('http://localhost:3000/books');
        const books = response.data;

        res.json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Task 11: Search by ISBN, using promises
app.get('/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;

    // Assuming there's an external API providing book data
    axios.get(`http://localhost:3000/books/isbn/${isbn}`)
        .then((response) => {
            const book = response.data;
            res.json({ book });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Task 12: Search by Author
app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;

    // Assuming there's an external API providing book data
    axios.get(`http://localhost:3000/books/author/${author}`)
        .then((response) => {
            const books = response.data;
            res.json({ books });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Task 13: Search by Title
app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;

    // Assuming there's an external API providing book data
    axios.get(`http://localhost:3000/title/${title}`)
        .then((response) => {
            const books = response.data;
            res.json({ books });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});