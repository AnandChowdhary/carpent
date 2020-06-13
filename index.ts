import { exec as _exec } from "child_process";
import { join } from "path";
import ora from "ora";
import slugify from "@sindresorhus/slugify";
import { prompt } from "inquirer";

export const carpent = async (name: string, repo: string) => {
  const spinner = ora("Cloning git repository").start();
  const slug = slugify(name);

  // Clone the repo
  await exec(`git clone ${repo} ${slug}`);
  const path = join(".", slug);

  // Find .carpentrc

  // Return the result
  spinner.succeed(`Project ${slug} is ready in ./${path}`);
  return { path };
};

const exec = (command: string) =>
  new Promise((resolve, reject) => {
    _exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });

const DEFAULT = {
  questions: [
    {
      type: "input",
      message: "Project name",
      files: ["package.json"],
      find: "carpent",
    },
  ],
};

carpent("anand", "http://github.com/AnandChowdhary/carpent");
