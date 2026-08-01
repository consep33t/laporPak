"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, role } = formData;

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      setSuccess("Registration successful!");
      alert("Registration successful!");
      router.push("/auth/login");
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-clayBg px-4 py-12">
      <div className="w-full max-w-md shadow-clay rounded-[2.5rem] bg-clayPrimary p-8 md:p-12 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-8 text-clayBlue drop-shadow-sm">Register</h1>

        {error && <p className="text-red-500 text-center font-bold mb-6 bg-red-100 px-4 py-2 rounded-xl shadow-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-center font-bold mb-6 bg-green-100 px-4 py-2 rounded-xl shadow-sm">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-clayText ml-2 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-clayText ml-2 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-clayText ml-2 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full shadow-clay-active bg-clayPrimary text-clayText rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-medium"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="shadow-clay-btn active:shadow-clay-btn-active bg-clayBlue hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all duration-200 mt-4"
          >
            Register
          </button>
        </form>

        <p className="mt-8 text-center font-medium text-clayText">
          Already have an account?{" "}
          <a href="/auth/login" className="text-clayBlue hover:opacity-80 font-bold ml-1 transition-colors">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
