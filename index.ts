import { exec as _exec } from "child_process";
import { join } from "path";

export const carpent = async (name: string, repo: string) => {
  // Clone the repo
  const result = await exec(`git clone ${repo} ${name}`);
  const path = join(".", name);
  console.log({ path });
};

const exec = (command: string) =>
  new Promise((resolve, reject) => {
    _exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });

carpent("anand", "http://github.com/AnandChowdhary/carpent");
