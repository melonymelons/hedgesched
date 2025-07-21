"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const VALID_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
      
        function toUtcFromChinaTime(dayName, timeStr) {
          const [hours, minutes] = timeStr.split(":").map(Number);
          const cstDate = new Date(`2000-01-01T${timeStr}:00+08:00`);
          return cstDate;
        }

        function formatTimeFromUTC(utcDate) {
          const date = new Date(utcDate);
          date.setHours(date.getHours() + 8);
          return date.toISOString().slice(11, 16); 
        }
      
      

        export async function updateAvailability(data) {
          const { userId } = await auth();
          if (!userId) throw new Error("未经授权");
        
          const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            include: { availability: true },
          });
        
          if (!user) throw new Error("未找到用户");
        
          const availabilityData = Object.entries(data).flatMap(
            ([day, { isAvailable, startTime, endTime }]) => {
              const dayUpper = day.toUpperCase();
        
              if (isAvailable && VALID_DAYS.includes(dayUpper) && startTime && endTime) {
                return [
                  {
                    day: dayUpper,
                    startTime: toUtcFromChinaTime(dayUpper, startTime),
                    endTime: toUtcFromChinaTime(dayUpper, endTime),
                  },
                ];
              }
              return [];
            }
          );
        
          if (user.availability) {
            await db.availability.update({
              where: { id: user.availability.id },
              data: {
                timeGap: data.timeGap,
                days: {
                  deleteMany: {}, 
                  create: availabilityData.map(dayData => ({
                    day: dayData.day,
                    startTime: dayData.startTime,
                    endTime: dayData.endTime
                  }))
                },
              },
            });
          } else {
            await db.availability.create({
              data: {
                userId: user.id,
                timeGap: data.timeGap,
                days: {
                  create: availabilityData.map(dayData => ({
                    day: dayData.day,
                    startTime: dayData.startTime,
                    endTime: dayData.endTime
                  }))
                },
              },
            });
          }
        
          return { success: true };
        }


export async function getUserAvailability() {
    const { userId } = await auth();
    if (!userId) throw new Error("未经授权");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        availability: {
          include: { days: true },
        },
      },
    });
  
    if (!user || !user.availability) return null;
  
    const availabilityData = {
      timeGap: user.availability.timeGap,
    };
  
    const dayMap = {
      "SUNDAY": 0,
      "MONDAY": 1,
      "TUESDAY": 2,
      "WEDNESDAY": 3,
      "THURSDAY": 4,
      "FRIDAY": 5,
      "SATURDAY": 6
    };
  
    VALID_DAYS.forEach(dbDay => {
      const dayLower = dbDay.toLowerCase();
      const dayAvailability = user.availability.days.find(
        d => d.day === dbDay
      );
  
      availabilityData[dayLower] = {
        isAvailable: !!dayAvailability,
        startTime: dayAvailability
          ? formatTimeFromUTC(dayAvailability.startTime)
          : "09:00",
        endTime: dayAvailability
          ? formatTimeFromUTC(dayAvailability.endTime)
          : "17:00",
      };
    });
  
    return availabilityData;
  }