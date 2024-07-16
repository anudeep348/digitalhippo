import Link from "next/link";

import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SignInForm from "./SignInForm";

const Page = ({
  searchParams,
}: {
  searchParams: {
    as?: string;
  };
}) => {
  const { as } = searchParams;
  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">
              Sign in to your {as ? "seller account" : "account"}
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
              })}
              href="/sign-up"
            >
              Create a new account? Sign-up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <SignInForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
