"use server"
import prisma from "@/utils/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getSession() {
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
  return await supabase.auth.getUser();
}

export async function saveLaporan(data) {
  try {
    const { data: { user } } = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const laporan = await prisma.laporan.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        userEmail: user.email, // Force user email from session
        isAnonymous: data.isAnonymous,
        imageUrl: data.imageUrl,
        imageUrls: data.imageUrls || [],
        lat: data.lat,
        lng: data.lng,
        fullAddress: data.fullAddress,
        isEmergency: data.isEmergency,
      }
    });
    return { success: true, data: laporan };
  } catch (error) {
    console.error("Error saving laporan:", error);
    return { success: false, error: error.message };
  }
}

export async function getHistoryLaporanUser() {
  try {
    const { data: { user } } = await getSession();
    if (!user) return [];

    const laporan = await prisma.laporan.findMany({
      where: {
        userEmail: user.email,
      },
      orderBy: {
        createdAt: "desc",
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
    const { data: { user } } = await getSession();
    
    const laporan = await prisma.laporan.findMany({
      where: {
        status: {
          not: "Selesai" 
        }
      },
      take: 20, // Pagination
      orderBy: [
        { isEmergency: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        user: {
          select: { fullName: true, avatarUrl: true, badge: true }
        },
        _count: { select: { likes: true, comments: true } },
        likes: user ? {
          where: { userEmail: user.email },
          select: { id: true }
        } : false,
        comments: {
          take: 5,
          orderBy: { date: "asc" },
          include: {
            likes: user ? {
              where: { userEmail: user.email },
              select: { isLike: true }
            } : false,
            _count: { select: { likes: true, reports: true } }
          }
        }
      }
    });
    return laporan;
  } catch (error) {
    console.error("Error fetching all laporan:", error);
    return [];
  }
}

export async function toggleLike(laporanId) {
  try {
    const { data: { user } } = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const userEmail = user.email;

    const existingLike = await prisma.like.findUnique({
      where: {
        laporanId_userEmail: {
          laporanId,
          userEmail
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          laporanId,
          userEmail
        }
      });
      const laporan = await prisma.laporan.findUnique({ where: { id: laporanId } });
      if (laporan && laporan.userEmail !== userEmail) {
        await prisma.userProfile.update({
          where: { email: laporan.userEmail },
          data: { points: { increment: 1 } }
        });
      }
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: error.message };
  }
}

export async function addComment(laporanId, text) {
  try {
    const { data: { user } } = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const userEmail = user.email;
    const userName = user.user_metadata?.name || user.email.split("@")[0];
    
    // Validate if the user is an admin from metadata or email
    const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'agengprayoga@gmail.com' || user.email === 'admin@laporpak.com';

    const comment = await prisma.comment.create({
      data: {
        laporanId,
        userEmail,
        userName,
        text,
        isAdmin, 
      }
    });
    return { success: true, data: comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleCommentLike(commentId, isLike) {
  try {
    const { data: { user } } = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const userEmail = user.email;

    const existingReaction = await prisma.commentLike.findUnique({
      where: {
        commentId_userEmail: {
          commentId,
          userEmail
        }
      }
    });

    if (existingReaction) {
      if (existingReaction.isLike === isLike) {
        // Toggle off if clicking the same reaction
        await prisma.commentLike.delete({ where: { id: existingReaction.id } });
        return { success: true, action: 'removed' };
      } else {
        // Switch reaction
        await prisma.commentLike.update({
          where: { id: existingReaction.id },
          data: { isLike }
        });
        return { success: true, action: 'switched' };
      }
    } else {
      await prisma.commentLike.create({
        data: {
          commentId,
          userEmail,
          isLike
        }
      });
      return { success: true, action: 'added' };
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return { success: false, error: error.message };
  }
}

export async function reportComment(commentId, category, reason) {
  try {
    const { data: { user } } = await getSession();
    if (!user) return { success: false, error: "Unauthorized" };

    const userEmail = user.email;

    const report = await prisma.commentReport.create({
      data: {
        commentId,
        userEmail,
        category,
      }
    });
    return { success: true, data: report };
  } catch (error) {
    console.error("Error reporting comment:", error);
    return { success: false, error: error.message };
  }
}
