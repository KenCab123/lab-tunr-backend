// Dependencies
const express = require("express");

const playlists = express.Router({ mergeParams: true});

// Queries
const {
  getAllPlaylists,
  getPlaylist,
  newPlaylist,
  deletePlaylist,
  updatePlaylist,
} = require("../queries/playlists");


const { getAllSongs } = require("../queries/songs.js");

playlists.get('/:id/songs', async (req, res) => {
    const id = parseInt(req.params.id);

    const allSongs = await getAllSongs()

    res.json(allSongs.filter(s => s.playlist_id === id))
})


// INDEX
playlists.get("/", async (req, res) => {
  const allPlaylists = await getAllPlaylists();
  if (allPlaylists[0]) {
    res.status(200).json(allPlaylists);
  } else {
    res.status(500).json({ error: "server error" });
  }
});

// SHOW
playlists.get("/:id", async (req, res) => {
  const { id } = req.params;
  const playlist = await getPlaylist(id);

  if (playlist) {
    res.json(playlist);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// UPDATE
playlists.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedPlaylist = await updatePlaylist(id, req.body);
  if (updatedPlaylist.id) {
    res.status(200).json(updatedPlaylist);
  } else {
    res.status(404).json("Playlist not found");
  }
});

//CREATE
playlists.post("/", async (req, res) => {
  const playlist = await newPlaylist(req.body);
  res.status(200).json(playlist);
});

// DELETE
playlists.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedPlaylist = await deletePlaylist(id);

  if (deletedPlaylist.id) {
    res.status(200).json(deletedPlaylist);
  } else {
    res.status(404).json({ error: "Playlist not found" });
  }
});

// TEST JSON NEW
// {
//     "reviewer":"Lou",
//      "title": "Fryin Better",
//      "content": "With the great tips and tricks I found here",
//      "bookmark_id": "2",
//      "rating": "4"
// }
module.exports = playlists;