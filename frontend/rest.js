"use strict";

const endpoint = "http://localhost:3000";

import { showArtists } from "./script.js";

let selectedArtist;
let globalArtists;

async function updateArtistGrid() {
  const artists = await readArtists();
  globalArtists = artists;
  showArtists(artists);
}

async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

async function createArtist(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const genres = form.genres.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;

  const newArtist = {
    name,
    birthdate,
    activeSince,
    labels,
    website,
    genres,
    image,
    shortDescription,
  };

  const artistJSON = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistJSON,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    updateUsersGrid();
  }
}

async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateArtistGrid();
  }
}

// TJEK LIGE MERE OP PÅ DEN HER
function selectArtist(artist) {
  document.querySelector("#dialog-update-artist").showModal();
  // Set global varaiable
  selectedArtist = artist;
  const form = document.querySelector("#form-update-artist");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.shortDescription.value = artist.shortDescription;

  document.querySelector("#form-update-artist").addEventListener("submit", updateArtist);
}

async function updateArtist(event) {
  event.preventDefault();
  const form = event.target;

  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  // update user
  const artistToUpdate = { name, birthdate, activeSince, genres, labels, website, image, shortDescription };
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/artists/${selectedArtist.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    // if success, update the users grid
    updateArtistGrid();
  }
}

async function updateFavorite(artist) {
  console.log(artist);

  const name = artist.name;
  const birthdate = artist.birthdate;
  const activeSince = artist.activeSince;
  const genres = artist.genres;
  const labels = artist.labels;
  const website = artist.website;
  const image = artist.image;
  const shortDescription = artist.shortDescription;
  const favorite = artist.favorite;

  const favoriteToUpdate = { name, birthdate, activeSince, genres, labels, website, image, shortDescription, favorite };

  const favoriteAsJson = JSON.stringify(favoriteToUpdate);
  const response = await fetch(`${endpoint}/artists/${artist.id}`, {
    method: "PUT",
    body: favoriteAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    updateArtistGrid();
  }
}
export { updateArtist, createArtist, deleteArtist, selectArtist, updateArtistGrid, readArtists, updateFavorite };
