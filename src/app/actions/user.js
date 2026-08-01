"use server";

import prisma from "@/utils/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function ensureUserProfile() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_DBSUPABASE_URL,
    process.env.NEXT_PUBLIC_DBSUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  try {
    const profile = await prisma.userProfile.upsert({
      where: { email: user.email },
      update: {}, // Do nothing if exists
      create: {
        email: user.email,
        fullName: user.user_metadata?.name || user.email.split("@")[0],
      }
    });
    
    // Check if profile needs completion (e.g., missing NIK)
    const needsCompletion = !profile.nik || !profile.addressDetail;
    
    return { profile, needsCompletion };
  } catch (error) {
    console.error("Failed to ensure user profile:", error);
    return { error: error.message };
  }
}

export async function updateProfile(data) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_DBSUPABASE_URL,
    process.env.NEXT_PUBLIC_DBSUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  try {
    const profile = await prisma.userProfile.update({
      where: { email: user.email },
      data: {
        nik: data.nik,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        addressDetail: data.addressDetail,
        province: data.province,
        city: data.city,
        district: data.district,
        village: data.village,
        rt_rw: data.rt_rw,
        postalCode: data.postalCode,
      }
    });
    return { success: true, profile };
  } catch(e) {
    return { error: e.message };
  }
}
