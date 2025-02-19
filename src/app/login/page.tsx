"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LogoCover, Logo } from "@/assets";
import { loginSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/features/store/services/user";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response: any = await login(data);
      if (response.error) {
        console.log("response", response.error?.data?.message);
        toast.error(response.error?.data?.message || "Something went wrong!");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-end">
        {/* Left side with illustration */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md">
            <Image src={LogoCover} alt="Login illustration" className="dark:invert" priority />
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full max-w-md mx-auto space-y-6 -mt-20">
          <div className="space-y-2 text-center mb-5">
            <Image src={Logo} alt="DevSoul Logo" className="mx-auto mb-8 w-full h-auto" />
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className=" text-primary_text">Great food, warm vibes—welcome back</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email / User Name
              </label>
              <Input
                id="email"
                placeholder="Enter email / user name"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                {...register("username")}
                error={errors.username?.message}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Password" {...register("password")} error={errors.password?.message} />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button onClick={handleSubmit(onSubmit)} className="w-full h-14 !mt-10 bg-emerald-500 text-white hover:bg-emerald-600" loading={isLoading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
