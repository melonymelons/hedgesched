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
        const dayAvailability = user.availability.days.find(d => d.days === days.toUpperCase());

        availabilityData[day] = {
            isAvailable: !!dayAvailability,
            startTime: dayAvailability?dayAvailability.startTime.toISOString().slice(11, 16):"09:00",
            endTime: dayAvailability?dayAvailability.endTime.toISOString().slice(11, 16):"17:00",
        };

        
    });
 
    return availabilityData;
}