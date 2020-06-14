import slugify from "@sindresorhus/slugify";
import { exec as _exec } from "child_process";
import { pathExists, readJson, readFile, writeFile, remove } from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import { join } from "path";

export const carpent = async (
  defaultRepo?: string,
  defaultAnswers: { [index: string]: string } = {}
) => {
  // Ask input name
  if (!defaultAnswers.repo || !defaultAnswers.dir) {
    defaultAnswers = await inquirer.prompt([
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
  }

  // Clone the repo
  const spinner = ora("Cloning git repository").start();
  const slug = slugify(defaultAnswers.dir);
  await exec(`git clone ${defaultAnswers.repo} ${slug}`);
  spinner.stop();
  const path = join(".", slug);

  // Find .carpentrc
  let config: { questions: any[]; deleteFiles?: string[] } = DEFAULT;
  if (await pathExists(join(path, ".carpentrc")))
    config = await readJson(join(path, ".carpentrc"));

  // Ask questions
  const answers: { [index: string]: string } = await inquirer.prompt(
    config.questions
  );

  // Update values
  spinner.text = "Updating values";
  spinner.start();
  for await (const question of config.questions) {
    for await (const file of question.files) {
      const VAL = question.replace
        ? (question.replace as string).replace(
            new RegExp("$VALUE", "g"),
            answers[question.name]
          )
        : answers[question.name];
      let fileContents = await readFile(join(slug, file), "utf8");
      if (question.find)
        fileContents = fileContents.replace(
          new RegExp(question.find, "g"),
          VAL
        );

      // Support JSON key changes
      if (question.jsonKey) {
        const jsonContent: any = JSON.parse(fileContents);
        jsonContent[question.jsonKey] = VAL;
        fileContents = JSON.stringify(jsonContent, null, 2);
      }
      await writeFile(join(slug, file), fileContents);
    }
  }

  // Delete files
  spinner.text = "Deleting files";
  for await (const file of config.deleteFiles ?? []) {
    await remove(join(slug, file));
  }

  // Return the result
  spinner.succeed(`Project is ready in ./${path}`);
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
  deleteFiles: [".carpentrc"],
  questions: [
    {
      name: "name",
      type: "input",
      message: "Project name",
      files: ["package.json"],
      jsonKey: "name",
    },
    {
      name: "license",
      type: "input",
      message: "License",
      files: ["package.json"],
      jsonKey: "license",
      default: "MIT",
    },
  ],
};

carpent("http://github.com/AnandChowdhary/carpent");
