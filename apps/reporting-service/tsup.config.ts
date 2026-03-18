import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node18',
  clean: true,

  bundle: true,

  noExternal: [/@packages\//],

  external: ['sequelize', 'pg', 'pg-hstore'],
});
