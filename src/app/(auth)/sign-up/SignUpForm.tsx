"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AuthCredentialsValidaor,
  TAuthCredentialsValidaor,
} from "@/lib/validators/accountCredentialValidators";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidaor>({
    resolver: zodResolver(AuthCredentialsValidaor),
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({});

  const onsubmit = ({ email, password }: TAuthCredentialsValidaor) => {
    mutate({ email, password });
  };

  return (
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
        </div>

        <Button>Sign up</Button>
      </div>
    </form>
  );
};

export default SignUpForm;
