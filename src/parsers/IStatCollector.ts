export enum StatType {
  CssClass = 1,
  ApiMethod = 2,
}

export enum FileType {
  cs = "cs",
  cshtml = "cshtml",
  scss = "scss",
  ts = "ts",
  other = "other",
}

export interface ICommitFileInfo {
  fileType: FileType;
  filePath: string;
  content: string;
}

export interface ICommitInfo {
  hash: string;
  author: string;
  message: string;
  files: ICommitFileInfo[];
}

export interface IStatResult {
  statType: StatType;
  stats: { [k: string]: number };
}

export interface IStatCollector {
  canHandle(info: ICommitFileInfo): boolean;
  collectStat(fi: ICommitFileInfo): Promise<IStatResult>;
}
