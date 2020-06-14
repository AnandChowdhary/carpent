import slugify from "@sindresorhus/slugify";
import { exec as _exec } from "child_process";
import { pathExists, readJson, readFile, writeFile, remove } from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import { join } from "path";

/** Carpent question (inquirer) type */
export interface CarpentQuestion {
  name: string;
  type:
    | "checkbox"
    | "confirm"
    | "editor"
    | "expand"
    | "input"
    | "list"
    | "number"
    | "password"
    | "rawlist";
  message: string;
  default?: string;
  choices?: string[];
  files?: string[];
  jsonKey?: string;
  find?: string;
  replace?: string;
}

/** Carpent configuration object type */
export interface CarpentConfig {
  deleteFiles?: string[];
  questions?: CarpentQuestion[];
}

/**
 * Bootstrap a new project with Carpent
 * @param defaultAnswers - Object containing values
 */
export const carpent = async (
  defaultAnswers: { [index: string]: string } = {}
) => {
  // Ask input name
  if (!defaultAnswers.repo || !defaultAnswers.dir) {
    defaultAnswers = await inquirer.prompt([
      {
        name: "repo",
        type: "input",
        message: "Git repository URL",
        default: defaultAnswers.repo,
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
  let config: CarpentConfig = DEFAULT;
  if (await pathExists(join(path, ".carpentrc")))
    config = await readJson(join(path, ".carpentrc"));

  // Ask questions
  const allQuestions: CarpentQuestion[] = [
    ...(config.questions ?? []),
    {
      name: "license",
      type: "list",
      message: "License",
      default: "MIT License",
      choices: Object.values(LICENSES),
    },
    {
      name: "licenseName",
      type: "input",
      message: "Name in license (usually full name)",
      default: slug,
    },
  ];
  const answers: { [index: string]: string } =
    Object.keys(defaultAnswers).length > 2
      ? defaultAnswers
      : await inquirer.prompt(allQuestions);

  // Update values
  spinner.text = "Updating values";
  spinner.start();
  for await (const question of allQuestions) {
    const VAL = question.replace
      ? (question.replace as string).replace(
          new RegExp("$VALUE", "g"),
          answers[question.name]
        )
      : answers[question.name];

    // Update each file
    for await (const file of question.files ?? []) {
      if (await pathExists(join(slug, file))) {
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

    // Update license
    if (question.name === "license") {
      const spdx = (Object.entries(LICENSES).find(
        (pair) => pair[1] === VAL
      ) ?? [""])[0];
      const licenseText = await readFile(
        join(".", "assets", "licenses", `${spdx}.txt`),
        "utf8"
      );

      // Create LICENSE file
      await writeFile(
        join(slug, "LICENSE"),
        licenseText
          .replace("$NAME", answers.licenseName)
          .replace("$YEAR", new Date().getFullYear().toString())
      );

      // Update license in package.json
      if (await pathExists(join(slug, "package.json"))) {
        let packageJson = await readJson(join(slug, "package.json"));
        packageJson.license = spdx;
        if (spdx === "UNLICENSED") packageJson.private = true;
        await writeFile(
          join(slug, "package.json"),
          JSON.stringify(packageJson, null, 2)
        );
      }
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

/**
 * Promise polyfill for `child_process.exec`
 * @param command - Command to execute
 */
const exec = (command: string) =>
  new Promise((resolve, reject) => {
    _exec(command, (error, stdout) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });

const DEFAULT: CarpentConfig = {
  deleteFiles: [".carpentrc"],
  questions: [
    {
      name: "name",
      type: "input",
      message: "Project name",
      files: ["package.json"],
      jsonKey: "name",
    },
  ],
};

/** Licenses (SPDX to name map) */
export const LICENSES = {
  "Apache-2.0": "Apache 2.0",
  "BSD-3-Clause": "BSD 3-clause",
  "CC-BY-SA-4.0": "Creative Commons Attribution Share-Alike (CC BY SA 4.0)",
  "GPL-3.0": "GPL 3.0",
  MIT: "MIT License",
  UNLICENSED: "No open-source license (private and proprietary)",
  "BSD-2-Clause": "BSD 2-clause",
  "CC-BY-4.0": "Creative Commons Attribution (CC BY 4.0)",
  "CC0-1.0": "Creative Commons Zero (CC0)",
  ISC: "ISC License",
  "MPL-2.0": "Mozilla Public License 2.0",
  Unlicense: "The Unlicense",
};
