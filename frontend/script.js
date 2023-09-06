"use strict";

window.addEventListener("load", initApp);

import { updateArtistGrid, createArtist, deleteArtist, updateArtist, selectArtist } from "./rest.js";

async function initApp() {
  console.log("js is working");
  await updateArtistGrid();
  //document.querySelector("#searchbar").addEventListener("keyup", inputSearchChanged);
  //document.querySelector("#searchbar").addEventListener("search", inputSearchChanged);

  document.querySelector("#create-artist-btn").addEventListener("click", showCreateUserDialog);
  document.querySelector("#form-create-artist").addEventListener("submit", createArtist);

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
    document.querySelector("#artists article:last-child .btn-update").addEventListener("click", () => selectArtist(artist));
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

export { showArtists };
