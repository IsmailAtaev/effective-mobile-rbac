import { contract } from '@api/contracts';
import { s } from '@app/router';
import { authRouter } from '@app/user/auth/controller';
import { userRouter } from '@app/user/controller';

export const router = s.router(contract, {
  auth: authRouter,
  user: userRouter,
});