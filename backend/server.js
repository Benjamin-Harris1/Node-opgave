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
  const sortedData = artists.sort((a, b) => a.name.localeCompare(b.name));
  response.json(sortedData);
});

app.get("/artists/:id", async (request, response) => {
  console.log(request.params);
  const artistId = Number(request.params.id);
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  const result = artists.find((artist) => artist.id == artistId);
  response.json(result);
});
