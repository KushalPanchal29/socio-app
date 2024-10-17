const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const db = require('../config/db');

const router = express.Router();
const JWT_SECRET = '123';

async function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results); 
        }
      });
    });
  }

router.post('/signup', [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use the promisified query function
        const result = await queryAsync(
            'INSERT INTO USERS (USER_NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const user = { id: result.insertId, username, email };
        const token = jwt.sign(user, JWT_SECRET);

        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'Username or email already exists' });
        } else {
            res.status(500).json({ message: 'Error signing up' });
        }
    }
});

router.post('/login', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').exists().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const results = await queryAsync(
            'SELECT * FROM USERS WHERE EMAIL = ?',
            [req.body.email]
        );

        if (!Array.isArray(results)) {
            console.error('Unexpected database query result:', results);
            return res.status(500).json({ message: 'Server error' });
        }

        const user = results.length > 0 ? results[0] : null; 

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }  

        const isPasswordValid = await bcrypt.compare(req.body.password, user.PASSWORD);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.USER_ID, username: user.USER_NAME, email: user.EMAIL }, JWT_SECRET);

        res.json({ token, user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' }); 
    }
});


module.exports = router;
