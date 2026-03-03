import { ENV } from '@/lib/env.js';
import app from './app.js';
import connectToDB from './lib/connectToDB.js';

const server = async () => {
  try {
    await connectToDB();
    if (ENV.isProduction) {
      app.listen(ENV.PORT, () => {
        console.log(`Server running in production mode on port ${ENV.PORT}`);
      });
    } else {
      app.listen({ port: ENV.PORT, host: ENV.HOST }, () => {
        console.log(`Server is running in ${ENV.NODE_ENV} mode`);
        console.log(`HOST URL: http://${ENV.HOST}:${ENV.PORT}`);
        console.log(`LOCAL URL: http://localhost:${ENV.PORT}`);
        console.log(`\nAPI URL: http://localhost:${ENV.PORT}/api/v1/`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

server();
