const db = require("../db/dbConfig.js");

const getAllPlaylists = async () => {
  try {
    const allPlaylists = await db.any("SELECT * FROM playlists");
    return allPlaylists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return error;
  }
};

const getPlaylist = async (id) => {
  try {
    const onePlaylist = await db.one("SELECT * FROM playlists WHERE id=$1", id);
    return onePlaylist;
  } catch (error) {
    return error;
  }
};

const newPlaylist = async (playlist) => {
  try {
    const newPlaylist = await db.one(
      "INSERT INTO playlists (title) VALUES($1) RETURNING *",
      [
        playlist.title,
      ]
    );
    return newPlaylist;
  } catch (error) {
    return error;
  }
};

const deletePlaylist = async (id) => {
  try {
    const referencingSongs = await db.any("SELECT id FROM songs WHERE playlist_id = $1", [id]);
    if (referencingSongs.length > 0) {
        await db.none("DELETE FROM songs WHERE playlist_id = $1", [id]);
      }
  
    const deletedPlaylist = await db.one(
      "DELETE FROM playlists WHERE id=$1 RETURNING *",
      [id]
    );
    return deletedPlaylist;
  } catch (error) {
    return error;
  }
};

const updatePlaylist = async (id, playlist) => {
  try {
    const updatedPlaylist = await db.one(
      "UPDATE playlists SET title=$1 where id=$2 RETURNING *",
      [
        playlist.title,
        id,
      ]
    );
    return updatedPlaylist;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllPlaylists,
  getPlaylist,
  newPlaylist,
  deletePlaylist,
  updatePlaylist,
};