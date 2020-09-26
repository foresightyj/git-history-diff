// import chalk from "chalk";
import { getCommits } from "./commits";
(async () => {
  for await (const info of getCommits()) {
    console.log("info", info.author, info.message);
  }
})();
