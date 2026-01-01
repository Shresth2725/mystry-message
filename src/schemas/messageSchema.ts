import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be if atlest 10 character" })
    .max(300, { message: "content must be less than 300 charcter" }),
});
