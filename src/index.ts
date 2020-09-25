import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import chalk from "chalk";
import _ from "lodash";

const root = path.resolve(__dirname, "../../FHT.Web.SVN/");

const git: SimpleGit = simpleGit({
  baseDir: root,
});

(async () => {
  const logs = await git.log();
  for (const log of _.take(logs.all, 10)) {
    console.log(
      chalk.bgRed(log.author_name),
      log.date,
      chalk.green(log.message)
    );
    const show = await git.show(["--pretty=format:", "--name-only", log.hash]);
    const filesChanged = show
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s);
    console.log("show", filesChanged);
  }
})();
