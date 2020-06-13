import { exec as _exec } from "child_process";
import { join } from "path";
import ora from "ora";
import slugify from "@sindresorhus/slugify";
import {} from "inquirer";

export const carpent = async (name: string, repo: string) => {
  const spinner = ora("Cloning git repository").start();

  // Clone the repo
  const result = await exec(`git clone ${repo} ${name}`);
  const path = join(".", name);

  // Return the result
  spinner.succeed(`Project ${path} is ready`);
  return { path };
};

const exec = (command: string) =>
  new Promise((resolve, reject) => {
    _exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });

carpent("anand", "http://github.com/AnandChowdhary/carpent");
