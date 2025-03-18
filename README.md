# Grapegram-Web-Client

Web-client for the Grapegram messenger.

## Tech stack

<div align="center">
    <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=9C36CF" alt="Typescript" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
        <img src="https://img.shields.io/badge/-Vue-black?style=for-the-badge&logoColor=white&logo=vuedotjs&color=212121" alt="Vue" />
    </a>
    <a href="https://headlessui.dev/" target="_blank">
        <img src="https://img.shields.io/badge/-Headless UI-black?style=for-the-badge&logoColor=white&logo=headlessui&color=9C36CF" alt="headlessui" />
    </a>
    <a href="https://tailwindcss.com/" target="_blank">
        <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=212121" alt="tailwindcss" />
    </a>
    <a href="https://pinia.vuejs.org/" target="_blank">
        <img src="https://img.shields.io/badge/-Pinia-black?style=for-the-badge&logo=redux&logoColor=white&color=9C36CF" alt="Pinia" />
    </a>
    <a href="https://feature-sliced.github.io/documentation/" target="_blank">
        <img src="https://img.shields.io/badge/-Feature_Sliced_Design-black?style=for-the-badge&logoColor=white&logo=githubactions&color=212121" alt="Feature Sliced Design" />
    </a>
</div>

## Dev instruments

<div align="center">
    <a href="https://vitejs.dev/" target="_blank">
        <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=9C36CF" alt="Vite" />
    </a>
    <a href="https://yarnpkg.com/" target="_blank">
        <img src="https://img.shields.io/badge/-Yarn-black?style=for-the-badge&logoColor=white&logo=yarn&color=212121" alt="Yarn" />
    </a>
    <a href="https://eslint.org/" target="_blank">
        <img src="https://img.shields.io/badge/-Eslint-black?style=for-the-badge&logoColor=white&logo=eslint&color=9C36CF" alt="eslint" />
    </a>
    <a href="https://prettier.io/" target="_blank">
        <img src="https://img.shields.io/badge/-prettier-black?style=for-the-badge&logoColor=white&logo=prettier&color=212121" alt="prettier" />
    </a>
    <a href="https://github.com/features/actions" target="_blank">
        <img src="https://img.shields.io/badge/-github_actions-black?style=for-the-badge&logoColor=white&logo=githubactions&color=9C36CF" alt="githubactions" />
    </a>
</div>

## See live demos

Production: [https://grapegram-web.netlify.app](https://grapegram-web.netlify.app)
Development: [https://dev-grapegram-web.netlify.app](https://dev-grapegram-web.netlify.app)

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
