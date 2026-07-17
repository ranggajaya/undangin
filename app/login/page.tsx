"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ambil error dari URL query param jika ada (misal dari callback auth)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
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
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-ink/70"
          >
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs font-medium text-terracotta hover:underline"
          >
            Lupa Password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••"
          className="w-full rounded-lg border border-ink/20 px-3.5 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-terracotta py-2.5 text-sm font-medium text-cream hover:bg-terracotta/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta">
            <span className="font-heading text-lg text-cream">U</span>
          </div>
          <h1 className="font-heading text-2xl text-ink">Selamat Datang</h1>
          <p className="mt-1 text-sm text-ink/60">
            Masuk untuk mengelola undangan pernikahan digitalmu
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-sm">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center text-sm">
          <span className="text-ink/60">Belum punya akun? </span>
          <a
            href="/register"
            className="font-medium text-terracotta hover:underline"
          >
            Daftar
          </a>
        </div>
      </div>
    </main>
  );
}
