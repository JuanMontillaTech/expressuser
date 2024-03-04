const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Conexión a la base de datos SQLite
//const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('./data.db');
// Crear tabla si no existe
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
});

// Rutas
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/users', (req, res) => {
    debugger;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            name: name,
            email: email
        });
    });
});

app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    db.run("UPDATE users SET name=?, email=? WHERE id=?", [name, email, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User updated successfully" });
    });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM users WHERE id=?", id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User deleted successfully" });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
