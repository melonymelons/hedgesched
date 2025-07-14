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