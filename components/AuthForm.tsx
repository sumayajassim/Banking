"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignIn, SignUp } from "@/lib/actions/user.actions";

// 2. Define a submit handler.

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === "sign-up") {
        const newUser = await SignUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await SignIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link
          rel="stylesheet"
          href="/"
          className="mb-12 cursor-pointer items-center gap-2 flex"
        >
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user ? "Link your account" : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="First Name"
                      placeholder="Please Enter Your First Name"
                      name="firstName"
                    />
                    <CustomInput
                      control={form.control}
                      label="Last Name"
                      placeholder="Please Enter Your Last Name"
                      name="lastName"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    label="Address"
                    placeholder="Please Enter Your Address"
                    name="address"
                  />
                  <CustomInput
                    control={form.control}
                    label="city"
                    placeholder="Please Enter Your City"
                    name="city"
                  />

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="State"
                      placeholder="Example: NY"
                      name="state"
                    />
                    <CustomInput
                      control={form.control}
                      label="Postal Code"
                      placeholder="Example: 5645"
                      name="postalCode"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                      name="dob"
                    />
                    <CustomInput
                      control={form.control}
                      label="SSN"
                      placeholder="Example: 1234"
                      name="ssn"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                label="Email"
                placeholder="Please Enter Your Email Address"
                name="email"
              />
              <CustomInput
                control={form.control}
                label="Password"
                placeholder="Please Enter Your Password"
                name="password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign-up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
