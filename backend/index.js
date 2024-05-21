const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'student_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Create a new student
app.post('/students', (req, res) => {
    const { name, email, phone, enrollNumber, dateOfAdmission } = req.body;
    const sql = 'INSERT INTO students (name, email, phone, enrollNumber, dateOfAdmission) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, enrollNumber, dateOfAdmission], (err, result) => {
        if (err) throw err;
        res.send({ id: result.insertId, name, email, phone, enrollNumber, dateOfAdmission });
    });
});

// Read all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Update a student
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, enrollNumber, dateOfAdmission } = req.body;
    const sql = 'UPDATE students SET name = ?, email = ?, phone = ?, enrollNumber = ?, dateOfAdmission = ? WHERE id = ?';
    db.query(sql, [name, email, phone, enrollNumber, dateOfAdmission, id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Student updated successfully' });
    });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Student deleted successfully' });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});