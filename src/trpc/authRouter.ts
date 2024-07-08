import { AuthCredentialsValidaor } from "../lib/validators/accountCredentialValidators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../getPaylod";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidaor)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      //   check if user already exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return {
        success: true,
        sentToEmail: email,
      };
    }),
});