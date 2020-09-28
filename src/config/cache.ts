import { RedisOptions } from 'ioredis';
import 'dotenv';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: process.env.DRIVER_NAME,
  config: {
    redis: {
      host: process.env.HOST_IP,
      port: process.env.HOST_PORT,
      password: process.env.HOST_PASSWORD,
    },
  },
} as ICacheConfig;
