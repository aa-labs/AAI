import "dotenv/config";
import express from "express";
import cors from "cors";
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

// const prodAPi = new ChatGPTAPI({
//   apiKey: process.env.OPENAI_API_KEY || "",
//   completionParams: {
//     model: "gpt-4",
//     temperature: 0.5,
//     top_p: 0.8,
//   },
//   debug: true
// });

const proxyAPi = new ChatGPTUnofficialProxyAPI({
  accessToken: process.env.OPENAI_ACCESS_TOKEN || "",
  apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
});

app.use("/api", async function (req: any, res: any) {
  // const data = await prodAPi.sendMessage(
  //   "what is the answer to the universe?",
  //   {
  //     systemMessage: `You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each responseIf you are generating a list, do not have too many items.
  // Current date: ${new Date().toISOString()}\n\n`,
  //   }
  // );

  const data = await proxyAPi.sendMessage("!");
  console.log(data);
  res.send("API");
});

app.get("/", async function (req: any, res: any) {
  res.send("Backend");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server starting on port ${process.env.PORT || 4000}...`);
});
