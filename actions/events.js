"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";

export async function createEvent(data){
    const {userId} = await auth();
    if(!userId) {
        throw new Error("未经授权");
    }
 
    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({
        where:{ clerkUserId:userId },
    });

    if(!user) {
        throw new Error("未找到用户");
    }

    const event = await db.event.create({
        data:{
            ...validatedData,
            userId: user.id,
        },
    });

    return event;
}

export async function getUserEvents() {
   const {userId} = await auth();

    if(!userId) {
        throw new Error("未经授权");
    }
 
    const user = await db.user.findUnique({
        where:{ clerkUserId: userId },
    });

    if(!user) {
        throw new Error("未找到用户");
    }

    const events = await db.event.findMany({
       where: {userId: user.id}, 
       orderBy: {createdAt: "desc"},
       include: {
        _count: {
            select: {bookings: true},
        },
       },
    });

    return {events, username: user.username};
}

export async function deleteEvent(eventId) {
    const {userId} = await auth();
 
     if(!userId) {
         throw new Error("未经授权");
     }
  
     const user = await db.user.findUnique({
         where:{ clerkUserId: userId },
     });
 
     if(!user) {
         throw new Error("未找到用户");
     }
 
     const event = await db.event.findUnique({
       where:{id: eventId },
     });
 
     if(!event || event.userId !== user.id) {
        throw new Error("Event not found or unauthorized");
     }

     await db.event.delete({
        where:{id: eventId },
     });

     return {success: true};
 }

//main issue that i fixed: doing const {userId} = await auth(); <-- adding the await call instead of just auth(); 
//another issue was that i misnamed the "const events" into "const event" in line 48

export async function getEventDetails(username, eventId) {
    const event = await db.event.findFirst({
        where: {
            id: eventId,
            user: {
                username: username,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    username: true,
                    imageUrl: true,
                },
            },
        },
    });

    return event;
}

export async function getEventAvailability(eventId) {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          include: {
            availability: {
              include: { days: true },
            },
          },
        },
      },
    });
  
    if (!event || !event.user.availability) return [];
  
    const { days, timeGap } = event.user.availability;
    const result = [];
    const today = new Date();
  
    // Helper to format date in China Standard Time (yyyy-MM-dd)
    function formatDateToCST(date) {
      const chinaTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return chinaTime.toISOString().split("T")[0];
    }
  
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      // Determine CST weekday name
      const weekday = new Date(date.getTime() + 8 * 60 * 60 * 1000)
        .toLocaleDateString("en-US", {
          weekday: "long",
          timeZone: "Asia/Shanghai",
        })
        .toUpperCase();
  
      const match = days.find((d) => d.day === weekday);
      if (!match) continue;
  
      const slots = [];
      
                    const startTime = new Date(match.startTime);
                    const endTime = new Date(match.endTime);
                    
                    // Use the real date we're looping over, but apply only the hour/minute from availability
                    const year = date.getUTCFullYear();
                    const month = date.getUTCMonth();
                    const day = date.getUTCDate();
                    
                    let currentUTC = new Date(Date.UTC(year, month, day, startTime.getUTCHours(), startTime.getUTCMinutes()));
                    const endUTC = new Date(Date.UTC(year, month, day, endTime.getUTCHours(), endTime.getUTCMinutes()));
                    
                    while (currentUTC < endUTC) {
                        const chinaTime = new Date(currentUTC.getTime() + 8 * 60 * 60 * 1000);
                        const slotStr = chinaTime.toISOString().slice(11, 16); // HH:mm format
                        slots.push(slotStr);
                    
                        currentUTC = new Date(currentUTC.getTime() + timeGap * 60 * 1000);
                    }
                    
      result.push({
        date: formatDateToCST(date),
        slots,
      });
    }
  
    return result;
  }
//^replacement
  





function generateAvailabilityTimeSlots(
    startTime,
    endTime,
    duration,
    bookings,
    dateStr,
    timeGap = 0
) {
    const slots = []

    let currentTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 16)}`);
    const slotEndTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 16)}`);

    const now = new Date();
    if(format(now, "yyyy-MM-dd") === dateStr) {
        currentTime = isBefore(currentTime, now)?addMinutes(now, timeGap)
        : currentTime;
    }

    while(currentTime < slotEndTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);

        const isSlotAvailable = !bookings.some(booking => {
            const bookingStart = booking.startTime;
            const bookingEnd = booking.endTime;

            return (
                (currentTime  >= bookingStart && currentTime < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (currentTime <= bookingStart && slotEnd >= bookingEnd)
            );
        });

        if(isSlotAvailable) {
            slots.push(format(currentTime, "HH:mm"));
        }

        currentTime = slotEnd;
    }

    return slots;
}