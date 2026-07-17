"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/ui/AuthCard";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      description="Masukkan email Anda untuk menerima link pemulihan password"
      footer={
        <a href="/login" className="font-medium text-terracotta hover:underline">
          Kembali ke Login
        </a>
      }
    >
      {success ? (
        <div className="rounded-xl bg-sage/10 p-4 text-center text-sm text-ink">
          <p className="font-semibold text-sage">Link Reset Terkirim!</p>
          <p className="mt-2 text-ink/75">
            Silakan periksa kotak masuk email Anda untuk melanjutkan proses reset password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="nama@email.com"
            registration={register("email")}
            errorMessage={errors.email?.message}
          />
          <SubmitButton isLoading={isLoading} label="Kirim Link Reset" loadingLabel="Mengirim..." />
        </form>
      )}
    </AuthCard>
  );
}
