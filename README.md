# Grapegram-Web-Client

Web-client for the Grapegram messenger.

## Tech stack

<div align="center">
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=9C36CF" alt="Typescript" />
    <img src="https://img.shields.io/badge/-Vue-black?style=for-the-badge&logoColor=white&logo=vuedotjs&color=212121" alt="Vue" />
    <img src="https://img.shields.io/badge/-Headless UI-black?style=for-the-badge&logoColor=white&logo=headlessui&color=9C36CF" alt="headlessui" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=212121" alt="tailwindcss" />
</div>

## Dev instruments

<div align="center">
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=9C36CF" alt="Vite" />
    <img src="https://img.shields.io/badge/-Yarn-black?style=for-the-badge&logoColor=white&logo=yarn&color=212121" alt="Yarn" />
    <img src="https://img.shields.io/badge/-Eslint-black?style=for-the-badge&logoColor=white&logo=eslint&color=9C36CF" alt="eslint" />
    <img src="https://img.shields.io/badge/-prettier-black?style=for-the-badge&logoColor=white&logo=prettier&color=212121" alt="prettier" />
    <img src="https://img.shields.io/badge/-github_actions-black?style=for-the-badge&logoColor=white&logo=githubactions&color=9C36CF" alt="githubactions" />
</div>

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

If you are using VSCode, you can install the recommended extensions for development. Just search for `@recommended` in the extensions tab and install them.

## Run locally

Clone repository on your local machine:

```bash
git clone https://github.com/Grapegram/web-client.git
```

Move into project folder:

```bash
cd ./web-client
```

Install all dependencies from `package.json`:

```bash
yarn
```

To start a project in `development mode`, enter the following command in the console:

```bash
yarn dev
```

## Custom project scripts

Formatting project files according to the `.prettierrc.json`:

```bash
yarn format
```

Linting project files according to the `eslint.config.ts`:

```bash
yarn lint
```

To run project unit tests:

```bash
yarn test:unit
```

## Build locally

Full production build of the project:

```bash
yarn build
```

Build and run production build of the project:

```bash
yarn preview
```
