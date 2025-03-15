# Starklings App

![STARKLINGS](./.github/hero-banner.svg)

A web-based interactive tutorial to learn Cairo and Starknet.

## About

The Starklings App is an interactive web platform designed to assist users in embarking on their journey to learn Cairo. This platform is built upon [Starklings](https://github.com/shramee/starklings-cairo1) exercises, which are considered essential for beginners seeking to grasp the fundamentals of Cairo.

Our objective is to simplify the Starklings experience by eliminating complex configurations and installations. Simply access the app through your browser and begin coding.

## Components

### Backend

The backend of the Starklings App is responsible for handling data processing and interactions with the Starknet exercises. 
Follow these steps to set up and run the backend:

```bash
cd app/api/
```

Install dependencies:

```bash
pnpm i
```

Run the development server:

```bash
pnpm run dev
```

### Frontend

The frontend is the user interface of the Starklings App, providing an interactive environment for users to engage with Cairo exercises. 
To get the frontend up and running, follow these steps:

```bash
cd app/client/
```

Install dependencies:

```bash
pnpm i
```

Launch the development server:

```bash
pnpm run start
```

## Cairo runtime

Cairo runtime is based on Cairo WASM from [@cryptonerdcn](https://github.com/cryptonerdcn).

We use a modified fork (kudos to [@dpinones](https://github.com/dpinones)) of the runtime. The fork provides more detailed test logs, making it easier for identifying and debugging the issues.
- [Cairo WASM Fork - github.com/dpinones/wasm-cairo/tree/cairo-2.8.2](https://github.com/dpinones/wasm-cairo/tree/cairo-2.8.2)  
- [Cairo Fork - github.com/dpinones/cairo/commits/cairo-2.8.2](https://github.com/dpinones/cairo/commits/cairo-2.8.2)
