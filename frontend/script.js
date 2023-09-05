"use strict";

window.addEventListener("load", initApp);

import { updateArtistGrid, createArtist, deleteArtist, artistClicked, updateArtist } from "./rest.js";

async function initApp() {
  console.log("js is working");
  await updateArtistGrid();
  //document.querySelector("#searchbar").addEventListener("keyup", inputSearchChanged);
  //document.querySelector("#searchbar").addEventListener("search", inputSearchChanged);

  document.querySelector("#create-artist-btn").addEventListener("click", showCreateUserDialog);
  document.querySelector("#form-create-artist").addEventListener("submit", createArtistClicked);
  //document.querySelector("#sortByRole").addEventListener("change", filterByMemberRoles);

  //document.querySelector("#sortByTeam").addEventListener("change", teamSelect);
}

// Search
/*function inputSearchChanged(event) {
  const input = event.target.value;
  const listOfUsers = searchUsers(input);
  showUsers(listOfUsers);
}

function searchUsers(search) {
  search = search.toLowerCase().trim();
  console.log(search);
  const results = users.filter((user) => user.firstName.toLowerCase().trim().includes(search) || user.lastName.toLowerCase().trim().includes(search));
  return results;
}

function filterList() {
  const filteredList = getAllRole(users, filterOption);
  const filteredTeamList = filterByTeam(filteredList);

  return filteredTeamList;
}*/

function showCreateUserDialog() {
  document.querySelector("#dialog-create-artist").showModal();
}

async function createArtistClicked(event) {
  const form = event.target;
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activesince = form.activeSince.value;
  const genres = form.genres.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;
  const image = form.image.value;
  form.reset();
  const response = await createArtist(name, birthdate, activesince, genres, website, shortDescription, image);
  if (response.ok) {
    showSnackbar("Bruger oprettet");
    updateArtistGrid();
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
}

function showArtists(artists) {
  console.log(artists);
  document.querySelector("#artists").innerHTML = "";
  for (const artist of artists) {
    const html = /*html*/ `
    <article class="grid-item-user">
  <img src="${artist.image}">
  <h3>${artist.name} </h3>
  <p>${artist.birthdate}</p>
<p>${artist.genres}</p>
<p>${artist.shortDescription}</p>

  <div class="btns">
  <button class="btn-favorite">Mark as favorite</button>
  <button class="btn-update">Update</button>
  <button class="btn-delete">Delete</button>
  </div>
</article>
`;

    document.querySelector("#artists").insertAdjacentHTML("beforeend", html);
    document.querySelector("#artists article:last-child .btn-delete").addEventListener("click", () => deleteClicked(artist));
    document.querySelector("#artists article:last-child .btn-update").addEventListener("click", () => updateClicked(artist));
    document.querySelector("#artists article:last-child img").addEventListener("click", () => showUserModal(artist));
  }
}

/*function filterByMemberRoles(event) {
  const role = event.target.value;
  filterOption = role;
  console.log(filterOption);
  updateArtistGrid();
}

function filterByTeam(list) {
  console.log(list);
  if (teamOption != "") {
    const filterTeam = list.filter(function (user) {
      return user.subscription == teamOption;
    });
    console.log(filterTeam);
    return filterTeam;
  } else return list;
}

function teamSelect(event) {
  teamOption = event.target.value;

  update;
  console.log(teamOption);
}*/

function updateClicked(artist) {
  document.querySelector("#dialog-update-artist").showModal();
  document.querySelector("#update-name").value = artist.name;
  document.querySelector("#update-birthdate").value = artist.birthdate;
  document.querySelector("#update-activeSince").value = artist.activeSince;
  document.querySelector("#update-genres").value = artist.genres;
  document.querySelector("#update-label").value = artist.label;
  document.querySelector("#update-website").value = artist.website;
  document.querySelector("#update-image").value = artist.image;
  document.querySelector("#update-shortDescription").value = artist.shortDescription;

  document.querySelector("#form-update-artist").addEventListener("submit", updateArtistClicked);
}

async function updateArtistClicked(event) {
  const form = event.target;
  const id = form.getAttribute("data-id");
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const label = form.label.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  form.reset();
  const response = await updateArtist(id, name, birthdate, activeSince, genres, label, website, image, shortDescription);
  if (response.ok) {
    showSnackbar("Bruger opdateret");
    updateUsersGrid();
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
  console.log("knappen virker");
}

function deleteClicked(artist) {
  console.log("Knappen Virker");
  document.querySelector("#dialog-delete-artist").showModal();
  document.querySelector("#dialog-delete-artist-name").textContent = artist.name;
  document.querySelector("#form-delete-artist").setAttribute("data-id", artist.id);
  document.querySelector("#btn-no").addEventListener("click", function () {
    document.querySelector("#dialog-delete-artist").close();
  });
  document.querySelector("#form-delete-artist").addEventListener("submit", deleteUserClicked);
}

async function deleteUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const response = await deleteArtist(id);
  if (response.ok) {
    updateUsersGrid();
    showSnackbar("Bruger slettet");
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
  form.reset();
  document.querySelector("#dialog-delete-artist").close();
}

function showUserModal(artist) {
  document.querySelector("#dialog-name").textContent = artist.name;
  document.querySelector("#dialog-genre").textContent = artist.genre;
  document.querySelector("#dialog-birthdate").textContent = artist.birthdate;
  document.querySelector("#dialog-image").src = artist.image;
  // show dialog
  document.querySelector("#dialog-artist-info").showModal();
}

function showSnackbar(message) {
  const snackbarSelector = document.querySelector(`#snackbar`);
  snackbarSelector.textContent = `${message}`;
  snackbarSelector.classList.add("show");
  setTimeout(() => {
    snackbarSelector.classList.remove("show");
  }, 3000);
}

export { showArtists };
