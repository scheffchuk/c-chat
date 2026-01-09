"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "code";

export function SignInWithOTP() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn("resend-otp", { email });
      setStep("code");
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn("resend-otp", { email, code });
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "code") {
    return (
      <form className="flex flex-col gap-3" onSubmit={handleVerifyCode}>
        <p className="text-muted-foreground text-sm">
          We sent a code to <span className="font-medium">{email}</span>
        </p>
        <Input
          autoComplete="one-time-code"
          autoFocus
          disabled={isLoading}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          type="text"
          value={code}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button disabled={isLoading || !code} type="submit">
          {isLoading ? "Verifying..." : "Verify code"}
        </Button>
        <Button
          className="text-muted-foreground"
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
          type="button"
          variant="link"
        >
          Use a different email
        </Button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSendCode}>
      <div className="relative">
        <MailIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input
          autoComplete="email"
          autoFocus
          className="pl-10"
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          value={email}
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button disabled={isLoading || !email} type="submit">
        {isLoading ? "Sending code..." : "Continue with email"}
      </Button>
    </form>
  );
}
