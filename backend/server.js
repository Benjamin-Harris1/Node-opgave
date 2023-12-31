import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (request, response) => {
  response.send("Express.js working");
});

app.get("/artists", async (request, response) => {
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  response.json(artists);
});

app.get("/artists/:id", async (request, response) => {
  console.log(request.params);
  const artistId = Number(request.params.id);
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  const result = artists.find(artist => artist.id == artistId);
  response.json(result);
});

app.post("/artists", async (request, response) => {
  console.log(request.body);
  const artist = request.body;
  artist.id = new Date().getTime();
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  artists.push(artist);
  fs.writeFile("data.json", JSON.stringify(artists));
  response.json(artists);
});

app.put("/artists/:id", async (request, response) => {
  const id = request.params.id;
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);

  let updatedArtists = artists.find(artist => artist.id == id);

  if (request.body.favorite !== undefined) {
    updatedArtists.favorite = request.body.favorite;
  }

  const body = request.body;
  updatedArtists.name = body.name;
  updatedArtists.birthdate = body.birthdate;
  updatedArtists.activeSince = body.activeSince;
  updatedArtists.genres = body.genres;
  updatedArtists.labels = body.labels;
  updatedArtists.website = body.website;
  updatedArtists.image = body.image;
  updatedArtists.shortDescription = body.shortDescription;

  fs.writeFile("data.json", JSON.stringify(artists));
  response.json(updatedArtists);
});

app.delete("/artists/:id", async (request, response) => {
  const id = request.params.id;
  console.log(id);
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);

  const newArtist = artists.filter(artist => artist.id != id);
  fs.writeFile("data.json", JSON.stringify(newArtist));
  response.json(artists);
});
