"use strict";

const endpoint = "http://localhost:3000";

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
    
}
