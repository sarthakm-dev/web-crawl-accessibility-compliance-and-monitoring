'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require('ioredis'));
exports.redis = new ioredis_1.default({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 5) {
      console.error('Redis retry attempts exhausted');
      return null;
    }
    return 2000;
  },
});
exports.redis.on('connect', () => {
  console.log('Redis connected');
});
exports.redis.on('error', err => {
  console.error('Redis error:', err.message);
});
