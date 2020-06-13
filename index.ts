import slugify from "@sindresorhus/slugify";
import { exec as _exec } from "child_process";
import { pathExists, readJson, readFile, writeFile } from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import { join } from "path";

export const carpent = async (defaultRepo?: string) => {
  // Ask input name
  const { repo, dir } = await inquirer.prompt([
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
  const spinner = ora("Cloning git repository").start();
  const slug = slugify(dir);
  await exec(`git clone ${repo} ${slug}`);
  spinner.stop();
  const path = join(".", slug);

  // Find .carpentrc
  let config: { questions: any[] } = DEFAULT;
  if (await pathExists(join(path, ".carpentrc")))
    config = await readJson(join(path, ".carpentrc"));

  // Ask questions
  const answers: { [index: string]: string } = await inquirer.prompt(
    config.questions
  );

  // Update values
  config.questions.forEach((question, index) => {
    ((question.files ?? []) as string[]).forEach(async (file) => {
      let fileContents = await readFile(join(slug, file), "utf8");
      if (question.find)
        fileContents = fileContents.replace(
          new RegExp(question.find, "g"),
          question.replace
            ? (question.replace as string).replace(
                "$VALUE",
                answers[question.name]
              )
            : answers[question.name]
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
      name: "name",
      type: "input",
      message: "Project name",
      files: ["package.json"],
      find: "carpent",
    },
    {
      name: "license",
      type: "input",
      message: "License",
      files: ["package.json"],
      find: `"license": "MIT"`,
      replace: `"license": "$VALUE"`,
      default: "MIT",
    },
  ],
};

carpent("http://github.com/AnandChowdhary/carpent");
