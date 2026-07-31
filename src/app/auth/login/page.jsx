"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-clayBg px-4">
      <div className="shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 w-full max-w-md flex flex-col justify-center items-center transition-all duration-300">
        <h1 className="text-2xl font-bold mb-8 text-clayBlue text-center drop-shadow-sm">Selamat Datang di LaporPak</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
          />
          <button
            type="submit"
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all duration-200 mt-2"
          >
            Login
          </button>
          <p className="text-center text-clayText font-medium">
            Belum punya akun?{" "}
            <a
              href="/auth/register"
              className="text-clayBlue hover:opacity-80 font-bold ml-1 transition-colors"
            >
              Register
            </a>
          </p>
        </form>
        {error && <p className="text-red-500 font-bold mt-4 bg-red-100 px-4 py-2 rounded-xl shadow-sm text-center w-full">Email atau Password salah</p>}
      </div>
    </div>
  );
}
