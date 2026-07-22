"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/ui/AuthCard";
import { FormInput } from "@/components/ui/FormInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) setError(errorParam);
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        rightElement={
          <a href="/forgot-password" className="text-xs font-medium text-terracotta hover:underline">
            Lupa Password?
          </a>
        }
      />
      <SubmitButton isLoading={isLoading} label="Masuk" loadingLabel="Memproses..." />
    </form>
  );
}

export function LoginPageClient() {
  return (
    <AuthCard
      title="Selamat Datang"
      description="Masuk untuk mengelola undangan pernikahan digitalmu"
      footer={
        <>
          <span className="text-ink/60">Belum punya akun? </span>
          <a href="/register" className="font-medium text-terracotta hover:underline">
            Daftar
          </a>
        </>
      }
    >
      <Suspense fallback={<div className="text-center text-sm text-ink/60">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
