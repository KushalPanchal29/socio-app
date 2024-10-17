const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors')
const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(32).toString('hex'); 


const app = express();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: 'http://localhost:3000',  // Allow requests from your frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
        credentials: true,  // Allow sending cookies or authentication headers (if needed)
    }
));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// useEffect(() => {
    //   const fetchUserData = async () => {
    //     try {
            
    //       const token = localStorage.getItem('token');
    //       if (token) {
                
    //         const response = await axios.get('http://localhost:8080/api/users/home', {
    //           headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setUser(response.data.user);
    //         setIsLoggedIn(true);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching user data:', error);
    //       // Clear token if it's invalid
    //       localStorage.removeItem('token');
    //     }
    //   };
  
    //   fetchUserData();
    // }, []);