"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta">
            <span className="font-heading text-lg text-cream">U</span>
          </div>
          <h1 className="font-heading text-2xl text-ink">Reset Password</h1>
          <p className="mt-1 text-sm text-ink/60">
            Masukkan email Anda untuk menerima link pemulihan password
          </p>
        </div>

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
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="nama@email.com"
                className="w-full rounded-lg border border-ink/20 px-3.5 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-terracotta py-2.5 text-sm font-medium text-cream hover:bg-terracotta/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <a
            href="/login"
            className="font-medium text-terracotta hover:underline"
          >
            Kembali ke Login
          </a>
        </div>
      </div>
    </main>
  );
}
