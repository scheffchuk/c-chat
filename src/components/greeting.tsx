"use client";

import { motion } from "motion/react";
import { useAuth } from "@/lib/auth-client";

export default function Greeting() {
  const { user } = useAuth();

  return (
    <div
      className="justiy-center mx-auto mt-4 flex size-full max-w-3xl flex-col px-4 font-semibold text-2xl text-primary/90 md:mt-16 md:px-8 md:text-4xl"
      key="overview"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
      >
        {user ? `Hi ${user.name?.split(" ")[0] ?? "there"}!` : "Hi, Stranger!"}
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
      >
        {user ? "How can I help you today?" : "You have to login first."}
      </motion.div>
    </div>
  );
}
