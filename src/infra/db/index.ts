import { db } from './db';
export { db };

export const connectCheck = async () => {
  await db.connection().execute(async (c) => { });
  console.log('db connected');
};