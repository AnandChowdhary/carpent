#!/usr/bin/env node
import { carpent } from "./index";

const repoPath = process.argv[1];
const dirPath = process.argv[2];

carpent({
  repo: repoPath,
  dir: dirPath,
});
