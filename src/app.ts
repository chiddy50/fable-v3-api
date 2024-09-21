// app.ts
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import UserController from "./controllers/User";
import StoryController from "./controllers/Story";
import CharacterController from "./controllers/Character";
import TransactionController from "./controllers/Transaction";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());

app.use("/users", UserController);
app.use("/stories", StoryController);
app.use("/characters", CharacterController);
app.use("/transactions", TransactionController);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
