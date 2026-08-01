"use server"
import prisma from "@/utils/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function verifyAdmin() {
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
  if (!user) throw new Error("Unauthorized");
  // Temporary: In V5, user with specific email or role metadata is Admin
  const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'agengprayoga@gmail.com' || user.email === 'admin@laporpak.com';
  if (!isAdmin) throw new Error("Forbidden: Admins only");
  return user;
}

export async function getAdminLaporan(page = 1, limit = 20) {
  try {
    await verifyAdmin();

    const laporan = await prisma.laporan.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: { select: { fullName: true, nik: true, addressDetail: true, phoneNumber: true } },
        _count: { select: { likes: true } },
      },
      orderBy: [
        { isEmergency: 'desc' },
        // Sorting by likes count requires Prisma aggregate sorting feature which we might not have enabled, so we will sort by createdAt for now to prevent Prisma errors if it's not supported
        { createdAt: 'desc' }
      ]
    });

    return laporan;
  } catch (error) {
    console.error("Error fetching admin laporan:", error);
    return [];
  }
}

export async function updateLaporanStatus(laporanId, newStatus, extraData = {}) {
  try {
    await verifyAdmin();
    const dataToUpdate = { status: newStatus };
    
    if (newStatus === "Diproses") {
      dataToUpdate.processStartDate = new Date();
      dataToUpdate.estimatedDays = extraData.estimatedDays ? parseInt(extraData.estimatedDays) : null;
    }
    
    if (newStatus === "Selesai") {
      if (extraData.afterImageUrl) {
        dataToUpdate.afterImageUrl = extraData.afterImageUrl;
      }
      if (extraData.adminResponse) {
        dataToUpdate.adminResponse = extraData.adminResponse;
      }
    }

    const updated = await prisma.laporan.update({
      where: { id: laporanId },
      data: dataToUpdate,
      include: { user: true }
    });

    // Kirim In-App Notification ke pelapor
    await prisma.notification.create({
      data: {
        userEmail: updated.userEmail,
        title: `Status Laporan Diperbarui`,
        message: `Laporan Anda "${updated.title}" sekarang berstatus: ${newStatus}`,
      }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating laporan status:", error);
    return { success: false, error: error.message };
  }
}
