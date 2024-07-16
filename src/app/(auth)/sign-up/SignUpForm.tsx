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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";

const SignUpForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidaor>({
    resolver: zodResolver(AuthCredentialsValidaor),
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast({
          description: "This email is already in use. Sign in instead?",
          variant: "destructive",
        });

        return;
      }

      if (err instanceof ZodError) {
        toast({
          description: err.issues[0].message,
          variant: "destructive",
        });

        return;
      }

      toast({
        description: "something went wrong.Please try again after some time",
        variant: "destructive",
      });
    },
    onSuccess: ({ sentToEmail }) => {
      toast({
        description: `Verification email sent to ${sentToEmail}`,
        variant: "success",
      });
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

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
            <p className="text-sm text-red-500">{errors?.password?.message}</p>
          )}
        </div>

        <Button disabled={isLoading}>Sign up</Button>
      </div>
    </form>
  );
};

export default SignUpForm;
