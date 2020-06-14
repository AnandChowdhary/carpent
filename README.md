# 🔨 Carpent

Bootstrap and configure any project using its template -- clone a repository, update data using variables, and more.

[![Node CI](https://img.shields.io/github/workflow/status/AnandChowdhary/carpent/Node%20CI?label=GitHub%20CI&logo=github)](https://github.com/AnandChowdhary/carpent/actions)
[![Travis CI](https://img.shields.io/travis/AnandChowdhary/carpent?label=Travis%20CI&logo=travis%20ci&logoColor=%23fff)](https://travis-ci.org/AnandChowdhary/carpent)
[![Coverage](https://coveralls.io/repos/github/AnandChowdhary/carpent/badge.svg?branch=master&v=2)](https://coveralls.io/github/AnandChowdhary/carpent?branch=master)
[![Dependencies](https://img.shields.io/librariesio/release/npm/carpent)](https://libraries.io/npm/carpent)
[![License](https://img.shields.io/npm/l/carpent)](https://github.com/AnandChowdhary/carpent/blob/master/LICENSE)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/carpent.svg)](https://snyk.io/test/npm/carpent)
[![Based on Carpent](https://img.shields.io/badge/based%20on-node.ts-brightgreen)](https://github.com/AnandChowdhary/node.ts)
[![npm type definitions](https://img.shields.io/npm/types/carpent.svg)](https://unpkg.com/browse/carpent/dist/index.d.ts)
[![npm package](https://img.shields.io/npm/v/carpent.svg)](https://www.npmjs.com/package/node.ts)
[![npm downloads](https://img.shields.io/npm/dw/carpent)](https://www.npmjs.com/package/node.ts)
[![Contributors](https://img.shields.io/github/contributors/AnandChowdhary/carpent)](https://github.com/AnandChowdhary/carpent/graphs/contributors)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![npm](https://nodei.co/npm/carpent.png)](https://www.npmjs.com/package/carpent)

## 💡 Usage

Install the package globally from [npm](https://www.npmjs.com/package/carpent):

```bash
npm install --global carpent
```

Use the CLI:

```bash
carpet
# Enter repo URL, package.json name, license, etc., and your project is ready
```

Or, import and use the API:

```ts
import { carpet } from "carpet";

carpet("https://github.com/AnandChowdhary/carpet");
```

### Setting up Carpent with your template

If you're building a template repository that others can use, you can add Carpent by creating a `.carpentrc` file in the root:

## 👩‍💻 Development

Build TypeScript:

```bash
npm run build
```

Run unit tests and view coverage:

```bash
npm run test-without-reporting
```

## 📄 License

[MIT](./LICENSE) © [Anand Chowdhary](https://anandchowdhary.com)
