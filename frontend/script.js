"use strict";

window.addEventListener("load", initApp);

import { updateArtistGrid, createArtist, selectArtist, readArtists, updateFavorite, deleteArtist } from "./rest.js";

async function initApp() {
  let artists = await readArtists();
  showArtists(artists);

  // SEARCH
  document.querySelector("#searchbar").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#searchbar").addEventListener("search", inputSearchChanged);

  // CREATE
  document.querySelector("#create-artist-btn").addEventListener("click", showCreateUserDialog);
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);

  // SORT
  document.querySelector("#sortByGenre").addEventListener("change", filterByGenre);
  document.querySelector("#sortByFavorite").addEventListener("change", filterByFavorite);
}

// Global variables
let globalArtists = await readArtists();
let genreOption = "genre";
let favoriteOption = "notchosen";

// FAVORITE
function addToFavorite(artist) {
  artist.favorite = true;
  updateFavorite(artist);
}

function removeFromFavorite(artist) {
  artist.favorite = false;
  updateFavorite(artist);
}

// SEARCH
function inputSearchChanged(event) {
  const input = event.target.value;
  const listOfArtists = searchUsers(input);
  showArtists(listOfArtists);
}

function searchUsers(search) {
  search = search.toLowerCase().trim();
  return globalArtists.filter(artist => artist.name.toLowerCase().trim().includes(search) || artist.genres.toLowerCase().trim().includes(search));
}

// FILTER AND SORT
function filterByGenre(event) {
  genreOption = event.target.value;
  if (genreOption === "genre") {
    // Reset the genre filter, and update the artist grid with all artists.
    genreOption = "genre";
    updateArtistGrid();
  } else {
    // Filter the artists based on the selected genre.
    const filteredArtists = globalArtists.filter(artist => artist.genres === genreOption);
    showArtists(filteredArtists);
  }
}

function filterByFavorite(event) {
  favoriteOption = event.target.value;
  console.log(favoriteOption);
  if (favoriteOption === "notchosen") {
    // Reset the filter, and update the artist grid with all artists
    favoriteOption = "notchosen";
    updateArtistGrid();
  } else {
    const isFavorite = favoriteOption === "true";

    const filteredArtists = globalArtists.filter(artist => artist.favorite == isFavorite);
    showArtists(filteredArtists);
  }
}

// SHOW
function showCreateUserDialog() {
  document.querySelector("#dialog-create-artist").showModal();
}

function showArtists(artists) {
  document.querySelector("#artists").innerHTML = "";
  const sortedArtists = artists.sort((a, b) => a.name.localeCompare(b.name));
  for (const artist of sortedArtists) {
    const favoriteStatus = artist.favorite ? "Marked as favorite" : "Not favorite";
    const html = /*html*/ `
    <article class="grid-item-user">
  <img src="${artist.image}">
  <h3>${artist.name} </h3>
  <p>Birthdate: ${artist.birthdate}</p>
<p> Genre: ${artist.genres}</p>
<p>${favoriteStatus}</p>



  <div class="btns">
  <button class="btn-update">Update</button>
  <button class="btn-delete">Delete</button>
  <button class="btn-favorite">Mark as favorite</button>
  <button class="btn-notfavorite" data-id="${artist.id}">Remove from favorites</button>
  </div>
</article>
`;

    document.querySelector("#artists").insertAdjacentHTML("beforeend", html);
    document.querySelector("#artists article:last-child .btn-delete").addEventListener("click", () => deleteClicked(artist));
    document.querySelector("#artists article:last-child .btn-update").addEventListener("click", () => selectArtist(artist));
    document.querySelector("#artists article:last-child .btn-favorite").addEventListener("click", () => addToFavorite(artist));
    document.querySelector("#artists article:last-child .btn-notfavorite").addEventListener("click", () => removeFromFavorite(artist));
    document.querySelector("#artists article:last-child img").addEventListener("click", () => showUserModal(artist));
  }
}

function showUserModal(artist) {
  document.querySelector("#dialog-name").textContent = artist.name;
  document.querySelector("#dialog-genre").textContent = artist.genre;
  document.querySelector("#dialog-birthdate").textContent = artist.birthdate;
  document.querySelector("#dialog-labels").textContent = artist.labels;
  document.querySelector("#dialog-favorite").textContent = artist.favorite;

  document.querySelector("#dialog-shortDescription").textContent = artist.shortDescription;
  document.querySelector("#dialog-image").src = artist.image;
  // show dialog
  document.querySelector("#dialog-artist-info").showModal();
}

//DELETE
function deleteClicked(artist) {
  document.querySelector("#dialog-delete-artist").showModal();
  document.querySelector("#dialog-delete-artist-name").textContent = artist.name;
  document.querySelector("#form-delete-artist").setAttribute("data-id", artist.id);
  document.querySelector("#btn-no").addEventListener("click", function () {
    document.querySelector("#dialog-delete-artist").close();
  });
  document.querySelector("#form-delete-artist").addEventListener("submit", deleteArtistClicked);
}

async function deleteArtistClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const response = await deleteArtist(id);
  if (response.ok) {
  } else {
    console.log(response.status, response.statusText);
  }
  form.reset();
  document.querySelector("#dialog-delete-artist").close();
}

function showSnackbar(message) {
  const snackbarSelector = document.querySelector(`#snackbar`);
  snackbarSelector.textContent = `${message}`;
  snackbarSelector.classList.add("show");
  setTimeout(() => {
    snackbarSelector.classList.remove("show");
  }, 10000);
}

export { showArtists, updateArtistGrid, filterByGenre, showSnackbar };
