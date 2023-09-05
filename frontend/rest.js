"use strict";

const endpoint = "http://localhost:3000";

import { showArtists } from "./script.js";

async function updateArtistGrid() {
  const artists = await readArtists();
  //const filteredList = filterList(artists);
  showArtists(artists);
}

async function readArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}

async function createArtist(event) {
  event.preventDefault();
  console.log("Create");
  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const label = form.label.value;
  const website = form.website.value;
  const genres = form.genres.value;
  const shortDescription = form.shortDescription.value;
  const image = form.image.value;

  const newArtist = {
    name,
    birthdate,
    activeSince,
    label,
    website,
    genres,
    shortDescription,
    image,
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
  selectedUser = artist;
  const form = document.querySelector("#form-update-artist");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.label.value = artist.label;
  form.website.value = artist.website;
  form.shortDescription.value = artist.shortDescription;
  form.image.value = artist.image;
}

async function updateArtist(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const label = form.label.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;
  const image = form.image.value;
  // update user
  const artistToUpdate = { name, birthdate, activeSince, genres, label, website, shortDescription, image };
  const artistAsJson = JSON.stringify(artistToUpdate);
  const response = await fetch(`${endpoint}/users/${selectedUser.id}`, {
    method: "PUT",
    body: artistAsJson,
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    updateArtistGrid();
  }
}

export { updateArtist, createArtist, deleteArtist, selectArtist, updateArtistGrid };
