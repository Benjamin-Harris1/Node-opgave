"use strict";



window.addEventListener("load", initApp);

async function initApp() {
  console.log("js is working");
  await updateUsersGrid();
  document.querySelector("#searchbar").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#searchbar").addEventListener("search", inputSearchChanged);
  showRole(document.querySelector("#coach-label"), "træner", "coach", "Vælg træner", users);
  showRole(document.querySelector("#coach-update-label"), "træner", "coach", "Vælg træner", users);

  document.querySelector("#create-user-btn").addEventListener("click", showCreateUserDialog);
  document.querySelector("#form-create-user").addEventListener("submit", createUserClicked);
  document.querySelector("#sortByRole").addEventListener("change", filterByMemberRoles);

  document.querySelector("#sortByTeam").addEventListener("change", teamSelect);
}

// Search
function inputSearchChanged(event) {
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

async function updateUsersGrid() {
  users = await getUsers();
  const filteredList = filterList();
  showUsers(filteredList);
}

function filterList() {
  const filteredList = getAllRole(users, filterOption);
  const filteredTeamList = filterByTeam(filteredList);

  return filteredTeamList;
}

function showCreateUserDialog() {
  document.querySelector("#dialog-create-user").showModal();
}

async function createUserClicked(event) {
  const form = event.target;
  const firstName = form.firstName.value;
  const lastName = form.lastName.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const subscription = form.subscription.value;
  const role = form.role.value;
  const discipline = form.discipline.value;
  const coach = form.coach.value;
  const image = form.image.value;
  const debt = form.debt.value;
  form.reset();
  const response = await createUser(role, subscription, discipline, age, coach, firstName, lastName, debt, gender, image);
  if (response.ok) {
    showSnackbar("Bruger oprettet");
    updateUsersGrid();
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
}

function showUsers(listOfUsers) {
  console.log(listOfUsers);
  document.querySelector("#users").innerHTML = "";
  listOfUsers.sort((a, b) => {
    if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
    else if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
    else return 0;
  });
  for (const users of listOfUsers) {
    showUser(users); // for every post object in listOfPosts, call showPost
  }
}

function filterByMemberRoles(event) {
  const role = event.target.value;
  filterOption = role;
  console.log(filterOption);
  updateUsersGrid();
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

  updateUsersGrid();
  console.log(teamOption);
}

function showUser(userObject) {
  //dom manipulation
  const html = /*html*/ `
<article class="grid-item-user">
  <img src="${userObject.image}">
  <h3>${userObject.firstName} ${userObject.lastName} </h3>
  <h3>${userObject.age} år</h3>
  <div class="btns">
  <button class="btn-update">Opdater</button>
  <button class="btn-delete">Slet</button>
  </div>
</article>
`;
  document.querySelector("#users").insertAdjacentHTML("beforeend", html);
  document.querySelector("#users article:last-child .btn-delete").addEventListener("click", () => deleteClicked(userObject));
  document.querySelector("#users article:last-child .btn-update").addEventListener("click", () => updateClicked(userObject));
  document.querySelector("#users article:last-child img").addEventListener("click", () => showUserModal(userObject));
}

function updateClicked(userObject) {
  document.querySelector("#dialog-update-user").showModal();
  document.querySelector("#update-firstName").value = userObject.firstName;
  document.querySelector("#update-lastName").value = userObject.lastName;
  document.querySelector("#update-age").value = userObject.age;
  document.querySelector("#update-gender").value = userObject.gender;
  document.querySelector("#update-subscription").value = userObject.subscription;
  document.querySelector("#update-role").value = userObject.role;
  document.querySelector("#discipline-output").textContent = userObject.discipline;
  // document.querySelector(`#${userObject.coachId}`);
  for (const coach of document.querySelectorAll(`#form-update-user .træner${userObject.coachId}`)) {
    coach.selected = true;
  }
  document.querySelector("#update-debt").value = userObject.debt;
  document.querySelector("#update-image").value = userObject.image;
  document.querySelector("#form-update-user").setAttribute("data-id", userObject.id);
  document
    .querySelector("#extra-discipline-btn-update")
    .addEventListener("click", () =>
      addDisciplineToOutput(document.querySelector("#update-discipline"), document.querySelector("#discipline-output"))
    );
  document
    .querySelector("#remove-disciplines-btn-update")
    .addEventListener("click", () => removeDisciplineToOutput(document.querySelector("#discipline-output")));
  document.querySelector("#form-update-user").addEventListener("submit", updateUserClicked);
}
function addDisciplineToOutput(disciplineSelector, outputSelector) {
  console.log("addToOutput");
  const disciplineValue = disciplineSelector.value;
  if (disciplineValue != "" && outputSelector.textContent.includes(disciplineValue) == false)
    if (outputSelector.textContent != "") outputSelector.textContent += ", " + disciplineValue;
    else outputSelector.textContent += disciplineValue;
}
function removeDisciplineToOutput(outputSelector) {
  outputSelector.textContent = "";
}

function deleteClicked(userObject) {
  console.log("Knappen Virker");
  document.querySelector("#dialog-delete-user").showModal();
  document.querySelector("#dialog-delete-user-name").textContent = userObject.firstName;
  document.querySelector("#form-delete-user").setAttribute("data-id", userObject.id);
  document.querySelector("#btn-no").addEventListener("click", function () {
    document.querySelector("#dialog-delete-user").close();
  });
  document.querySelector("#form-delete-user").addEventListener("submit", deleteUserClicked);
}

async function deleteUserClicked(event) {
  event.preventDefault();
  const form = event.target;
  const id = form.getAttribute("data-id");
  const response = await deleteUser(id);
  if (response.ok) {
    updateUsersGrid();
    showSnackbar("Bruger slettet");
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
  form.reset();
  document.querySelector("#dialog-delete-user").close();
}

async function updateUserClicked(event) {
  const form = event.target;
  const id = form.getAttribute("data-id");
  const firstName = form.firstName.value;
  const lastName = form.lastName.value;
  const age = form.age.value;
  const gender = form.gender.value;
  const subscription = form.subscription.value;
  const role = form.role.value;
  const discipline = form.discipline.value;
  const coach = form.coach.value;
  const image = form.image.value;
  const debt = form.debt.value;
  form.reset();
  const response = await updateUser(id, role, subscription, discipline, age, coach, firstName, lastName, debt, gender, image);
  if (response.ok) {
    showSnackbar("Bruger opdateret");
    updateUsersGrid();
  } else {
    console.log(response.status, response.statusText);
    showSnackbar("Noget gik galt. Prøv igen");
  }
  console.log("knappen virker");
}

function showUserModal(user) {
  document.querySelector("#dialog-age").textContent = user.age + " år gammel";
  document.querySelector("#dialog-name").textContent = `${user.firstName} ${user.lastName}`;
  document.querySelector("#dialog-subscription").textContent = capitalizeFirstLetter(user.subscription);
  document.querySelector("#dialog-role").textContent = capitalizeFirstLetter(user.role);
  if (document.querySelector("#dialog-discipline").textContent != "")
    document.querySelector("#dialog-discipline").textContent = capitalizeFirstLetter(user.discipline);
  else document.querySelector("#dialog-member-info > section > section > ul > li:nth-child(3)").hidden;
  document.querySelector("#dialog-gender").textContent = capitalizeFirstLetter(user.gender);
  document.querySelector("#dialog-image").src = user.image;

  console.log("");
  // show dialog
  document.querySelector("#dialog-member-info").showModal();
}

function showSnackbar(message) {
  const snackbarSelector = document.querySelector(`#snackbar`);
  snackbarSelector.textContent = `${message}`;
  snackbarSelector.classList.add("show");
  setTimeout(() => {
    snackbarSelector.classList.remove("show");
  }, 3000);
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
