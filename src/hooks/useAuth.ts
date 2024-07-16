import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { toast } = useToast();
  const router = useRouter();

  const signout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error();
      toast({
        description: "Logged out successfully",
        variant: "success",
      });
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      toast({
        description: "Couldn't sign out, please try again.",
        variant: "destructive",
      });
    }
  };
  return { signout };
};
