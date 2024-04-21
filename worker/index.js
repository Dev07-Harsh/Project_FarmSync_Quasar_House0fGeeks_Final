const express = require('express');
const { json } = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(json());

// API endpoint to register a new worker
app.post('/api/register-worker', async (req, res) => {
    try {
        const { email, password, name, workHistory, dailyRate, skills } = req.body;

        // Fetch worker's location using Geolocation API
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // Register the worker with location information
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                await db.collection('workers').doc(user.uid).set({
                    name: name,
                    email: email,
                    Contact: Contact,
                    location: location,
                    workHistory: workHistory,
                    dailyRate: dailyRate,
                    skills: skills,
                    availability: true,
                    ratings: []
                });
                res.status(201).json({ message: 'Worker registered successfully' });
            }, error => {
                console.error('Error fetching location:', error);
                res.status(500).json({ error: 'Error fetching location. Please enable location services.' });
            });
        } else {
            res.status(500).json({ error: 'Geolocation is not supported by your browser.' });
        }
    } catch (error) {
        console.error("Error registering worker: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to update worker's availability
app.put('/api/update-availability/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { availability } = req.body;
        await db.collection('workers').doc(workerId).update({ availability: availability });
        res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error("Error updating availability: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
