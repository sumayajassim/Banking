"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    console.log("getLoggedInUser", user);
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const SignIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
  }
};

export const SignUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;
  try {
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
    // Create  user  account
  } catch (error) {
    console.error("Error", error);
  }
};

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
}
