"use server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveLaporan(data) {
  try {
    const laporan = await prisma.laporan.create({
      data,
    });
    return { success: true, data: laporan };
  } catch (error) {
    console.error("Error saving laporan:", error);
    return { success: false, error: error.message };
  }
}

export async function getHistoryLaporanUser(email) {
  try {
    const laporan = await prisma.laporan.findMany({
      where: {
        email: email,
      },
      orderBy: {
        date: "desc",
      },
    });
    return laporan;
  } catch (error) {
    console.error("Error fetching user laporan:", error);
    return [];
  }
}

export async function getLaporan() {
  try {
    const laporan = await prisma.laporan.findMany({
      orderBy: {
        date: "desc",
      },
    });
    return laporan;
  } catch (error) {
    console.error("Error fetching all laporan:", error);
    return [];
  }
}
