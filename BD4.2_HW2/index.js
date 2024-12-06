import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db; // Declare the database instance

// Function to initialize the database
async function initializeDB() {
  try {
    db = await open({
      filename: './BD4.2_HW2/database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Database initialized.');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1); // Exit process if the database fails to initialize
  }
}

// Middleware to ensure the database is ready
app.use((req, res, next) => {
  if (!db) {
    return res
      .status(500)
      .json({ error: 'Database not initialized yet. Please try again later.' });
  }
  next();
});

// Function to fetch all tracks
async function fetchAllTracks() {
  try {
    const query = 'SELECT * FROM tracks';
    const response = await db.all(query);
    return { tracks: response };
  } catch (error) {
    console.error('Error fetching tracks:', error.message);
    throw error;
  }
}

// Endpoint to get all tracks
app.get('/tracks', async (req, res) => {
  try {
    const result = await fetchAllTracks();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks.' });
  }
});

// Retrieve Tracks by Artist

async function fetchTracksByArtist(artist) {
  let query = 'SELECT * FROM tracks WHERE artist = ?';
  let response = await db.all(query, [artist]);
  return { tracks: response };
}

app.get('/tracks/artist/:artist', async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTracksByArtist(artist);
    console.log(result);
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No track found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Tracks by Genre

async function fetchTracksByGenre(genre) {
  let query = 'SELECT * FROM tracks WHERE genre = ?';
  let response = await db.all(query, [genre]);
  return { tracks: response };
}

app.get('/tracks/genre/:genre', async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await fetchTracksByGenre(genre);
    console.log(result);
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No track found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Tracks by Release Year

async function fetchTracksByReleaseYear(year) {
  let query = 'SELECT * FROM tracks WHERE release_year = ?';
  let response = await db.all(query, [year]);
  return { tracks: response };
}

app.get('/tracks/release_year/:year', async (req, res) => {
  try {
    let year = req.params.year;
    let result = await fetchTracksByReleaseYear(year);
    console.log(result);
    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No track found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDB(); // Ensure the database is initialized before handling requests
});
