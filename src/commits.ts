import path from "path";
import _ from "lodash";
import simpleGit, { SimpleGit } from "simple-git";
import {
  ICommitInfo,
  FileType,
  ICommitFileInfo,
} from "./parsers/IStatCollector";
import assert from "assert";

const root = path.resolve(__dirname, "../../FHT.Web.SVN/");

const git: SimpleGit = simpleGit({
  baseDir: root,
});

export async function* getCommits(): AsyncIterable<ICommitInfo> {
  const logs = await git.log();
  for (const log of _.take(logs.all, 10)) {
    const show = await git.show(["--pretty=format:", "--name-only", log.hash]);
    const filesChanged = show
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s);

    const info: ICommitInfo = {
      hash: log.hash,
      author: log.author_name,
      message: log.message,
    };
    const fis: ICommitFileInfo[] = [];
    for (const fc of filesChanged) {
      const ext = path.extname(fc);
      assert(ext.startsWith("."));
      const fileType = FileType[ext.substr(1) as FileType] || FileType.other;

      const content = await git.show([`${log.hash}:${fc}`]);
      const fi: ICommitFileInfo = {
        fileType,
        filePath: fc,
        content: content,
      };
      fis.push(fi);
    }
    info.files = fis;
    yield info;
  }
}
