const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { v5: uuidv5 } = require('uuid'); // Import UUID version 5
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to add a driver
app.post('/api/driver', async (req, res) => {
    const { name, contact, license_number } = req.body;

    if (!name || !contact || !license_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const uniqueString = `${name}-${license_number}`;
        const uniqueId = uuidv5(uniqueString, uuidv5.DNS);
        const result = await pool.query(
            'INSERT INTO drivers (id, name, contact, license_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [uniqueId, name, contact, license_number]
        );
        return res.status(201).json({
            message: 'Driver added successfully',
            driver: result.rows[0],
        });
    } catch (error) {
        console.error('Error adding driver:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to fetch all drivers for editing
app.get('/api/drivers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM drivers');
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to update an existing driver
app.put('/api/driver/:id', async (req, res) => {
    const { id } = req.params;
    const { name, contact, license_number } = req.body;

    if (!name || !contact || !license_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE drivers SET name = $1, contact = $2, license_number = $3 WHERE id = $4 RETURNING *',
            [name, contact, license_number, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        return res.status(200).json({
            message: 'Driver updated successfully',
            driver: result.rows[0],
        });
    } catch (error) {
        console.error('Error updating driver:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
