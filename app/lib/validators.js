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