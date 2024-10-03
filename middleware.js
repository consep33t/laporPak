import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Redirect pengguna ke /auth/login jika tidak ada sesi
  },
});

export const config = {
  matcher: [
    "/", // Lindungi halaman root (dashboard utama)
  ],
};
