import z from "zod";

export const authorizationSchema = () => z.object({
    authorization: z.string().jwt({ alg: "HS256" })
})