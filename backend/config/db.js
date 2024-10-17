const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'socio-database.ch2wggmie4so.eu-north-1.rds.amazonaws.com',
//     user: 'kushal',
//     password: 'Kushal123',
//     database: 'socio-database',
// });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kushal0!8@5',
    database: 'SOCIO',
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the SOCIO database');
});

module.exports = connection;
