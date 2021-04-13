# isthepatchout

A website that automatically notifies when a new patch is released.

## Architecture

![](./architecture.png)

## Development

### Setup

1. Install dependencies: `$ yarn`
1. Copy the example `.env` file: `$ cp .env.example .env`

### UI

3. Run dev server: `$ yarn start`

### Serverless functions

3. Install the Vercel CLI: `$ npm i -g vercel`
4. Run dev server: `$ vercel dev`

You won't be able to use the UI without running it on a separate port due to some issue with Vite and Vercel's CLI.
