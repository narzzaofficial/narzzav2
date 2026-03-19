import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Masuk Admin",
  description: "Masuk ke admin panel Narzza menggunakan akun yang diizinkan.",
};

export default function SignInPage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10"
    >
      <section className="glass-panel w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-500 dark:text-sky-300">
          Admin Narzza
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Masuk ke dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Hanya akun admin yang bisa mengakses halaman pengelolaan konten.
        </p>

        <div className="mt-5 flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl="/admin"
            signUpUrl="/"
          />
        </div>
      </section>
    </main>
  );
}
