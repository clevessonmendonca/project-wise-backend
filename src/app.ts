import { app } from './infrastructure/config/server';

async function start() {
  try {
    const address = await app.listen({ port: 5000 });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
