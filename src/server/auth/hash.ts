import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = {
  hash: async (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
  },
  verify: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },
};
