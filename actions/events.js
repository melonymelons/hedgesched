"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

//main issue that i fixed: doing const {userId} = await auth(); <-- adding the await call instead of just auth(); 
//another issue was that i misnamed the "const events" into "const event" in line 48