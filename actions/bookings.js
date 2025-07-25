"use server";

import { db } from "@/lib/prisma";
import { format } from "date-fns";

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


export async function getBookedSlots(eventId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await db.booking.findMany({
        where: {
            eventId: eventId,
            startTime: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        select: {
            startTime: true
        }
    });

    return bookings.map(booking => 
        format(new Date(booking.startTime), 'HH:mm')
    );
}







  

/*
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
*/
