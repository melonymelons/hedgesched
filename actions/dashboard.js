"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getLastestUpdates() {
    const {userId} = await auth();

    if(!userId) {
        throw new Error("未经授权");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    
      if (!user) {
        throw new Error("未找到用户");
      }

      const now = new Date();
      const upcomingMeetings = await db.booking.findMany({
          where:{
              userId:user.id,
              startTime: { gte: now } ,
          },
          include: {
              event: {
                 select: {title:true},
              },
          },
          orderBy: {
              startTime: "asc",
          },
          take: 3,
      });
  
      return upcomingMeetings;
}