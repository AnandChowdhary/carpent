import slugify from "@sindresorhus/slugify";
import { exec as _exec } from "child_process";
import { pathExists, readJson, readFile, writeFile } from "fs-extra";
import { prompt } from "inquirer";
import ora from "ora";
import { join } from "path";

export const carpent = async (defaultRepo?: string) => {
  const spinner = ora("Cloning git repository").start();

  // Ask input name
  const { repo, dir }: { repo: string; dir: string } = await prompt([
    {
      name: "repo",
      type: "input",
      message: "Git repository URL",
      default: defaultRepo,
    },
    {
      name: "dir",
      type: "input",
      message: "Folder name",
    },
  ]);

  // Clone the repo
  const slug = slugify(dir);
  await exec(`git clone ${repo} ${slug}`);
  const path = join(".", slug);

  // Find .carpentrc
  let config: { questions: any[] } = DEFAULT;
  if (await pathExists(join(path, ".carpentrc")))
    config = await readJson(join(path, ".carpentrc"));

  // Ask questions
  const answers: { [index: string]: string } = await prompt(config.questions);

  // Update values
  config.questions.forEach((question, index) => {
    ((question.files ?? []) as string[]).forEach(async (file) => {
      let fileContents = await readFile(join(slug, file), "utf8");
      if (question.find)
        fileContents = fileContents.replace(
          question.find,
          question.replace
            ? (question.replace as string).replace("$VALUE", answers[index])
            : answers[index]
        );
      await writeFile(join(slug, file), fileContents);
    });
  });

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

carpent("http://github.com/AnandChowdhary/carpent");
