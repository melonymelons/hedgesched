"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient} from "@clerk/nextjs/server";

export async function updateUsername(username) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("未经授权");
    }

    const existingUsername = await db.user.findUnique({
        where:{ username },
    });

    if(existingUsername && existingUsername.id!==userId) {
        throw new Error("用户名已被使用");
    }

    await db.user.update({
        where:{clerkUserId: userId},
        data:{username},
    });

    await clerkClient.users.updateUser(userId, {
        username,
    });

    return {success:true};
}