"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/ui/AuthCard";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Password konfirmasi minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Pengecekan session: halaman ini hanya valid jika pengguna memiliki
  // session aktif (yang dibuat otomatis dari tautan reset di email).
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?error=Sesi reset tidak valid. Silakan minta link reset yang baru.");
        return;
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Memverifikasi sesi...</p>
      </main>
    );
  }

  return (
    <AuthCard title="Password Baru" description="Masukkan kata sandi baru untuk akun Anda">
      {success ? (
        <div className="rounded-xl bg-sage/10 p-4 text-center text-sm text-ink">
          <p className="font-semibold text-sage">Password Berhasil Diubah!</p>
          <p className="mt-2 text-ink/75">
            Password Anda telah diperbarui. Mengalihkan ke halaman masuk dalam 3 detik...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <FormInput
            id="password"
            label="Password Baru"
            type="password"
            placeholder="••••••"
            registration={register("password")}
            errorMessage={errors.password?.message}
          />
          <FormInput
            id="confirmPassword"
            label="Konfirmasi Password Baru"
            type="password"
            placeholder="••••••"
            registration={register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
          />
          <SubmitButton
            isLoading={isLoading}
            label="Simpan Password Baru"
            loadingLabel="Memperbarui..."
          />
        </form>
      )}
    </AuthCard>
  );
}
