import { Context } from 'grammy';

export const isUserAdminFilter = (adminListId: number[]) => {
  return (ctx: Context) => {
    return adminListId.includes(ctx.from.id);
  };
};
