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
    <div className="flex justify-center items-center h-screen w-full">
      <div className="container bg-white rounded-lg p-8 border-2 w-96 h-96 flex justify-center items-center flex-col">
        <h1>Silahkan Masukkan Data Diri Anda</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border-2 border-gray-300 p-2 rounded-md"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="border-2 border-gray-300 p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Login
          </button>
          <p>
            Belum punya akun?{" "}
            <a
              href="/auth/register"
              className="text-blue-500 hover:text-blue-700"
            >
              Register
            </a>
          </p>
        </form>
        {error && <p className="text-red-500">Email atau Password salah</p>}
      </div>
    </div>
  );
}
