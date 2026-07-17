"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/ui/AuthCard";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const registerSchema = z
  .object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password konfirmasi minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
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
      title="Daftar Akun"
      description="Mulai buat undangan pernikahan digitalmu"
      footer={
        <>
          <span className="text-ink/60">Sudah punya akun? </span>
          <a href="/login" className="font-medium text-terracotta hover:underline">
            Masuk
          </a>
        </>
      }
    >
      {success ? (
        <div className="rounded-xl bg-sage/10 p-4 text-center text-sm text-ink">
          <p className="font-semibold text-sage">Pendaftaran Berhasil!</p>
          <p className="mt-2 text-ink/75">
            Silakan periksa kotak masuk email Anda untuk mengaktifkan akun sebelum masuk.
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
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••"
            registration={register("password")}
            errorMessage={errors.password?.message}
          />
          <FormInput
            id="confirmPassword"
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••"
            registration={register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
          />
          <SubmitButton isLoading={isLoading} label="Daftar" loadingLabel="Memproses..." />
        </form>
      )}
    </AuthCard>
  );
}
