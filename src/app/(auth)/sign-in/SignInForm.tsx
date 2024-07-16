"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidaor,
  TAuthCredentialsValidaor,
} from "@/lib/validators/accountCredentialValidators";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchparams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidaor>({
    resolver: zodResolver(AuthCredentialsValidaor),
  });

  //   to check if user want to login as seller
  const isSeller = searchparams.get("as") === "seller";
  //   send the user back to where they were before login
  const origin = searchparams.get("origin");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast({
        description: "signed in successfully",
        variant: "success",
      });
      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isSeller) {
        router.push("/sell");
        return;
      }

      router.push("/");
    },

    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast({
          description: "invalid email or password",
          variant: "destructive",
        });
      }
    },
  });

  const onsubmit = ({ email, password }: TAuthCredentialsValidaor) => {
    signIn({ email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              className={cn({
                "focus-visible:ring-red-500": errors.email,
              })}
              placeholder="you@example.com"
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors?.email?.message}</p>
            )}
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={cn({
                "focus-visible:ring-red-500": errors.password,
              })}
              placeholder="password"
            />
            {errors?.password && (
              <p className="text-sm text-red-500">
                {errors?.password?.message}
              </p>
            )}
          </div>

          <Button disabled={isLoading}>Sign in</Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      {isSeller ? (
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={continueAsBuyer}
        >
          Continue as customer
        </Button>
      ) : (
        <Button
          variant="secondary"
          disabled={isLoading}
          onClick={continueAsSeller}
        >
          Continue as seller
        </Button>
      )}
    </>
  );
};

export default SignInForm;
