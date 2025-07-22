"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserMeetings(type = "upcoming") {
    const {userId} = await auth();
    if(!userId) {
        throw new Error("未经授权");
    }

    const user = await db.user.findUnique({
        where:{ clerkUserId:userId },
    });

    if(!user) {
        throw new Error("未找到用户");
    }

    const now = new Date();
    const meetings = await db.booking.findMany({
        where:{
            userId:user.id,
            startTime: type === "upcoming" ? { gte: now } : { lt: now },
        },
        include: {
            event: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            startTime: type === "upcoming" ? "asc" : "desc",
        },
    });

    return meetings;
}

export async function cancelMeeting(meetingId) {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("未经授权");
    }
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("未找到用户");
    }
  
    const meeting = await db.booking.findUnique({
      where: { id: meetingId },
      include: { event: true, user: true },
    });
  
    if (!meeting || meeting.userId !== user.id) {
      throw new Error("会议未找到或未经授权");
    }

    await db.booking.delete({
      where: { id: meetingId },
    });
  
    return { success: true };
  }