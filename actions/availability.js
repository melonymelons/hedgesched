
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


/*
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
          // Create a date in CST (UTC+8)
          const cstDate = new Date(`2000-01-01T${timeStr}:00+08:00`);
          // Return as UTC (automatically converts)
          return cstDate;
        }

        function formatTimeFromUTC(utcDate) {
          const date = new Date(utcDate);
          // Add 8 hours to convert UTC to CST
          date.setHours(date.getHours() + 8);
          return date.toISOString().slice(11, 16); // "HH:mm"
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
                  deleteMany: {}, // First delete all existing days
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
  
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach((day) => {
      const dayAvailability = user.availability.days.find(
        (d) => d.day === day.toUpperCase()
      );
  
      availabilityData[day] = {
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
*/






/*
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
                        
                            // Always use a fixed CST base date: 2000-01-01
                            const baseCST = new Date(`2000-01-01T${timeStr}:00+08:00`);
                        
                            // Now convert to UTC by shifting -8 hours
                            const utcTime = new Date(baseCST.getTime() - 8 * 60 * 60 * 1000);
                        
                            return utcTime;
                        }
      
      

export async function updateAvailability(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("未经授权");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { availability: true },
  });

  if (!user) throw new Error("未找到用户");

  //const baseDate = new Date().toISOString().split("T")[0];
  const baseDate = "2000-01-01";
  //Updated Base Date


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
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap,
        days: {
          create: availabilityData,
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
  
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ].forEach((day) => {
      const dayAvailability = user.availability.days.find(
        (d) => d.day === day.toUpperCase()
      );
  
      availabilityData[day] = {
        isAvailable: !!dayAvailability,
        startTime: dayAvailability
          ? new Date(dayAvailability.startTime).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Shanghai",
            })
          : "09:00",
        endTime: dayAvailability
          ? new Date(dayAvailability.endTime).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Shanghai",
            })
          : "17:00",
      };
    });
  
    return availabilityData;
  }
  */













/*
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserAvailability() {
    const {userId} = await auth();
 
    if(!userId) {
        throw new Error("未经授权");
    }

    const user = await db.user.findUnique({
        where:{ clerkUserId: userId },
        include: {
            availability : {
                include: {days: true},
            },
        },
    });

    if(!user || !user.availability) {
        return null;
    }

    const availabilityData = {
        timeGap: user.availability.timeGap,
    };

    [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ].forEach((day) => {
        const dayAvailability = user.availability.days.find(d => d.days === day.toUpperCase());

        availabilityData[day] = {
            isAvailable: !!dayAvailability,
            startTime: dayAvailability?dayAvailability.startTime.toISOString().slice(11, 16):"09:00",
            endTime: dayAvailability?dayAvailability.endTime.toISOString().slice(11, 16):"17:00",
        };

        
    });
 
    return availabilityData;
}

export async function updateAvailability(data) {
    const {userId} = await auth();
 
    if(!userId) {
        throw new Error("未经授权");
    }

    const user = await db.user.findUnique({
        where:{ clerkUserId: userId },
        include: {
            availability : true,
        },
    });

    if(!user) {
        throw new Error("未找到用户");
    }

    const availabilityData = Object.entries(data).flatMap(([day, {isAvailable, startTime, endTime}]) => {
        if(isAvailable) {
            const baseDate = new Date().toISOString().split("T")[0];

            return [
                {
                    day: day.toUpperCase(),
                    startTime: new Date(`${baseDate}T${startTime}:00+08:00`),
                    endTime: new Date(`${baseDate}T${endTime}:00+08:00`),
                },
            ];
        }
        return [];
    }
);

    if(user.availability) {
        await db.availability.update({
            where:{id:user.availability.id},
            data: {
                timeGap: data.timeGap,
                days: {
                    deleteMany: {},
                    create: availabilityData,
                },
            },
        });
    }
    else {
        await db.availability.create({
            data: {
                userId: user.id,
                timeGap: data.timeGap,
                days: {
                    create: availabilityData,
                },
            },
        });
    }

    return {success: true};
}
    */