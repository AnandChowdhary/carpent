import { carpent, getLicenseText } from "./index";
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
      pushAccess: "Do nothing, I'll initialize the repository myself",
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

describe("license fetcher", () => {
  it("fetches MIT license", async () => {
    expect(
      (await getLicenseText("MIT")).includes(
        "Permission is hereby granted, free of charge, to any person obtaining a copy"
      )
    ).toBeTruthy();
  });
  it("fetches ISC license", async () => {
    expect(
      (await getLicenseText("ISC")).includes(
        "Permission to use, copy, modify, and/or distribute this software for any"
      )
    ).toBeTruthy();
  });
  it("fetches CC BY 4.0 license", async () => {
    expect(
      (await getLicenseText("CC-BY-4.0")).includes(
        "By exercising the Licensed Rights (defined below), You accept and agree"
      )
    ).toBeTruthy();
  });
});
