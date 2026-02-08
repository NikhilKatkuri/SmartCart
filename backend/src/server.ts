import 'dotenv/config';

import app from './app.js';

const { NODE_ENV, PORT, HOST } = process.env;
const production_mode = NODE_ENV === 'production';

const server = async () => {
  try {
    if (!PORT && !production_mode) {
      throw new Error('PORT is not defined in environment variables');
    }
    if (!HOST && !production_mode) {
      throw new Error('HOST is not defined in environment variables');
    }

    if (production_mode) {
      app.listen(PORT, () => {
        console.log(`Server running in production mode on port ${PORT}`);
      });
    } else {
      app.listen({ port: PORT, host: HOST }, () => {
        console.log(`Server is running in ${NODE_ENV} mode`);
        console.log(`HOST URL: http://${HOST}:${PORT}`);
        console.log(`LOCAL URL: http://localhost:${PORT}`);
        console.log(`\nAPI URL: http://localhost:${PORT}/api/v1/`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

server();
