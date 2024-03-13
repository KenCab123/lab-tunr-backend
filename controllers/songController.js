const express = require('express');
const { getAllSongs, getSong, createSong, deleteSong, updateSong } = require('../queries/songs');
const { checkSong, checkBoolean } = require('../validations/checkSongs');

const songs = express.Router();

// INDEX
songs.get("/", async (req, res) => {
    const allSongs = await getAllSongs()
    if(allSongs[0]) {
        res.status(200).json(allSongs)
    } else {
        res.status(500).json({error: 'server error'})
    }
});


// SHOW
songs.get('/:id', async (req, res) => {
    const { id } = req.params;
    const song = await getSong(id)
    if(song) {
        res.json(song)
    } else {
        res.sendStatus(404).json({ error: 'not found'})
    }
});

// CREATE
songs.post('/', checkSong, checkBoolean, async (req, res) => {
    try {
        const song = await createSong(req.body)
        res.json(song)
    } catch (error) {
        res.status(400).json({ error: error})
    }
})

// DELETE
songs.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const deletedSong = await deleteSong(id)
    if(deletedSong.id) {
        res.status(200).json(deletedSong)
    } else {
        res.status(400).json("Song not found");
    }
})

// UPDATE
songs.put("/:id", checkSong, checkBoolean, async (req, res) => {
    const { id } = req.params;

    if(id) {
        const updatedSong = await updateSong(id, req.body)
        res.status(200).json(updatedSong)
    } else {
        res.status(400).json({ error })
    }
})


module.exports = songs;