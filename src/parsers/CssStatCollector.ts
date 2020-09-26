import {
  FileType,
  ICommitFileInfo,
  IStatCollector,
  IStatResult,
} from "./IStatCollector";

import postcss, { Root, Rule } from "postcss";
import syntax from "postcss-scss";

const processor = postcss();

export async function getScssRoot(ci: ICommitFileInfo): Promise<Root> {
  const result = await processor.process(ci.content, {
    syntax: syntax,
    from: ci.filePath,
  });
  const root = result.root!;
  return root;
}

export function getScssClassNames(root: Root): string[] {
  const names: string[] = [];
  root.walkRules((rule: Rule) => {
    const classes = rule.selector
      .split(/[\s,]/)
      .map((c) => c.trim())
      .filter((c) => c.startsWith("."))
      .map((c) => c.substr(1))
      .map((c) => c.split(/[:+]/)[0]);
    classes.forEach((c) => names.push(c));
  });
  return names;
}

export class CssStatCollector implements IStatCollector {
  canHandle(info: ICommitFileInfo): boolean {
    return info.fileType == FileType.scss;
  }
  async collectStat(cfi: ICommitFileInfo): Promise<IStatResult> {
    const root = await getScssRoot(cfi);
    const classes = getScssClassNames(root);
    console.log("classes", classes);
    const res: IStatResult = {};
  }
}
