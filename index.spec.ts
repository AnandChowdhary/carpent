import { carpent } from "./index";
import { pathExists, readFile, readJson, remove } from "fs-extra";
import { join } from "path";

describe("carpent", () => {
  beforeAll(async () => {
    await carpent({
      repo: "https://github.com/AnandChowdhary/carpent",
      dir: "example",
      name: "example-project",
      license: "ISC License",
      licenseName: "Anand Chowdhary",
    });
  }, 30000);

  afterAll(async () => {
    await remove(join(".", "example"));
  }, 5000);

  it("creates folder", async () => {
    expect(await pathExists(join(".", "example"))).toBeTruthy();
  });

  it("clones correct repository", async () => {
    expect(
      (await readFile(join(".", "example", "index.ts"), "utf8")).includes(
        "Carpent"
      )
    ).toBeTruthy();
  });

  it("sets license in package.json", async () => {
    expect(
      (await readJson(join(".", "example", "package.json"))).license === "ISC"
    ).toBeTruthy();
  });

  it("sets name in package.json", async () => {
    expect(
      (await readJson(join(".", "example", "package.json"))).name ===
        "example-project"
    ).toBeTruthy();
  });

  it("creates LICENSE file", async () => {
    expect(
      (await readFile(join(".", "example", "LICENSE"), "utf8")).includes(
        "ISC License"
      )
    ).toBeTruthy();
  });

  it("sets current year in LICENSE", async () => {
    expect(
      (await readFile(join(".", "example", "LICENSE"), "utf8")).includes(
        new Date().getFullYear().toString()
      )
    ).toBeTruthy();
  });

  it("sets full name in LICENSE", async () => {
    expect(
      (await readFile(join(".", "example", "LICENSE"), "utf8")).includes(
        "Anand Chowdhary"
      )
    ).toBeTruthy();
  });
});
