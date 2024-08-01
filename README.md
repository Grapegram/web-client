# Grapegram-Web-Client

Development of a web version of our messenger.

## Tech stack

<div align="center">
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=9C36CF" alt="Typescript" />
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=212121" alt="React" />
    <img src="https://img.shields.io/badge/-Redux-black?style=for-the-badge&logoColor=white&logo=redux&color=9C36CF" alt="Redux" />
    <img src="https://img.shields.io/badge/-shadcn-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=212121" alt="shadcnui" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=9C36CF" alt="tailwindcss" />
</div>

## Dev instruments

<div align="center">
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=9C36CF" alt="Vite" />
    <img src="https://img.shields.io/badge/-Yarn-black?style=for-the-badge&logoColor=white&logo=yarn&color=212121" alt="Yarn" />
    <img src="https://img.shields.io/badge/-biome-black?style=for-the-badge&logoColor=white&logo=biome&color=9C36CF" alt="biome" />
    <img src="https://img.shields.io/badge/-prettier-black?style=for-the-badge&logoColor=white&logo=prettier&color=212121" alt="prettier" />
    <img src="https://img.shields.io/badge/-github_actions-black?style=for-the-badge&logoColor=white&logo=githubactions&color=9C36CF" alt="githubactions" />
</div>

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

Formatting project files according to the `biome.json`:

```bash
yarn format
```

Formatting/Sorting file imports according to the `.prettierrc`:

```bash
yarn format-imports
```

To run project tests:

```bash
yarn test
```

## Build locally

To perform an optimised production build run:

```bash
yarn build
```

Show in browser:

```bash
yarn preview
```
