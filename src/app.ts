Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
});

// app.ts
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import UserController from "./controllers/User";
import StoryController from "./controllers/Story";
import CharacterController from "./controllers/Character";
import TransactionController from "./controllers/Transaction";
import StoryAccessController from "./controllers/StoryAccess";
import AuthenticationController from "./controllers/Authentication";
import HelperController from "./controllers/Helper";
import AssetController from "./controllers/Asset";
import ImageController from "./controllers/Image";
import ArticleController from "./controllers/Article";
import ArticleTransactionController from "./controllers/ArticleTransaction";
import ArticleCommentController from "./controllers/ArticleComment";
import TipController from "./controllers/Tip";
import ChapterController from "./controllers/Chapter";
import SceneController from "./controllers/Scene";
import CreditTransactionController from "./controllers/Credit";
import StoryControllerV2 from "./controllers/v2/Story";
import ChapterControllerV2 from "./controllers/v2/Chapter";
import AuthenticationControllerV2 from "./controllers/v2/Authentication";
import StoryCommentController from "./controllers/StoryComment";
import StoryGenreController from "./controllers/StoryGenre";
import SynopsisController from "./controllers/Synopsis";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());


app.use("/", HelperController);
app.use("/users", UserController);
app.use("/assets", AssetController);
app.use("/auth", AuthenticationController);

app.use("/stories", StoryController);

app.use("/characters", CharacterController);
app.use("/transactions", TransactionController);
app.use("/tips", TipController);
app.use("/story-access", StoryAccessController);
app.use("/images", ImageController);

app.use("/articles", ArticleController);
app.use("/article/transactions", ArticleTransactionController);
app.use("/article/comment", ArticleCommentController);

app.use("/chapters", ChapterController);
app.use("/scenes", SceneController);

app.use("/credits", CreditTransactionController);

app.use("/story-comments", StoryCommentController);
app.use("/story-genres", StoryGenreController);
app.use("/synopses", SynopsisController);




// VERSION 2 ROUTES
app.use("/v2/auth", AuthenticationControllerV2);
app.use("/v2/stories", StoryControllerV2);
app.use("/v2/chapters", ChapterControllerV2);




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// "seed": "npx prisma generate && npx prisma db push && node prisma/seed.js"
