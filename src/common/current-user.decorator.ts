import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export interface JwtPayload {
  sub: string;
  username: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req as { user?: JwtPayload };
    return req.user as JwtPayload;
  },
);
