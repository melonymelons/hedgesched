import { z } from "zod";

export const usernameSchema = z.object({
    username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/,
        "用户名只能包含字母、数字和下划线"
    ),
});

export const eventSchema = z.object({
    title: z
    .string()
    .min(1, "标题为必填项")
    .max(100, "标题不得超过 100 个字符"),
    description: z
    .string()
    .min(1, "描述为必填项")
    .max(500, "描述不得超过 500 个字符"),
    duration: z.number().int().positive("持续时间必须是正数"),

    isPrivate: z.boolean(),
});

export const daySchema = z.object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
}).refine((data) => {
    if(data.isAvailable){
        return data.startTime<data.endTime;
    }
    return true;
},{
    message: "结束时间必须早于开始时间",
    path: ["endTime"],
});

export const availabilitySchema = z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
    timeGap: z.number().min(0, "时间间隔必须为 0 分钟或以上").int(),
});

export const bookingSchema = z.object({
    name: z.string().min(1, "姓名为必填项"),
    email: z.string().email("电子邮件无效"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式无效"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "时间格式无效"),
    additionalInfo: z.string().optional(),
});