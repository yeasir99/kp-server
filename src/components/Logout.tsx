"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

type LogoutProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Logout = (props: LogoutProps) => {
  return (
    <Button
      onClick={() => signOut()}
      {...props}
      className="bg-red-600 hover:bg-red-700 cursor-pointer"
    >
      Logout
    </Button>
  );
};

export default Logout;
