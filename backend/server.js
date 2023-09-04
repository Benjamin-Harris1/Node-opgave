import express from "express";
import cors from "cors";

const server = express();
server.use(express.json());
server.use(cors());

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
