import fs from "fs";

const fsStat = (pathResolve) => {
  return new Promise((resolve, reject) => {
    fs.stat(pathResolve, (err, stat) => {
      if (err) {
        reject(err);
      } else {
        resolve(stat.isFile());
      }
    });
  });
};
export default fsStat;
