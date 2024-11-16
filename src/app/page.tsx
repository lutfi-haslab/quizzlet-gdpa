"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignOutButton,
  SignUp,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-2 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
      </div>
      <div className="flex flex-col items-center space-y-4">
        <SignedOut>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row justify-center items-center gap-5">
            <Link href="/dashboard">
              <div className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Dashboard
              </div>
            </Link>
            <div className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
              <SignOutButton />
            </div>
          </div>
          <UserProfile />
        </SignedIn>
      </div>
    </div>
  );
}
