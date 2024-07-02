import { z } from "zod";

export const AuthCredentialsValidaor = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters long" }),
});

export type TAuthCredentialsValidaor = z.infer<typeof AuthCredentialsValidaor>;
