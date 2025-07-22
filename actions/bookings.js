"use server";

import { db } from "@/lib/prisma";

export async function createBooking(bookingData){
    try{
        const event = await db.event.findUnique({
            where:{id: bookingData.eventId},
            include:{user:true},
        });

        if(!event) {
            throw new Error("未找到活动");
        }

    const booking = await db.booking.create({
        data: {
            eventId: event.id,
            userId: event.userId,
            name: bookingData.name,
            email: bookingData.email,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            additionalInfo: bookingData.additionalInfo,
        },
    });

    return { success: true, booking };

    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: error.message };
    }
}