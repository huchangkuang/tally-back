import * as fs from "fs";
import * as path from "path";
import fsStat from "./fsStat";

export type FileDirItem = {
  path: string;
  child?: FileDirItem[];
};
const walkFile = async (pathResolve: string): Promise<FileDirItem[]> => {
  const fileDirList: FileDirItem[] = [];
  const files = fs.readdirSync(pathResolve);
  const allFile = files.map((i) => {
    return async () => {
      const filePath = path.resolve(pathResolve, i);
      const isFile = await fsStat(filePath);
      let deepDir: FileDirItem[] = [];
      if (!isFile) {
        deepDir = await walkFile(filePath);
      }
      fileDirList.push({
        path: filePath,
        child: !isFile ? deepDir : undefined,
      });
    };
  });
  await Promise.all(allFile.map((i) => i()));
  return fileDirList;
};
export default walkFile;
