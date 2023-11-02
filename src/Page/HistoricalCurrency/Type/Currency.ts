import { z } from "zod";

export const currencySchema = z.object({
  country: z.string(),
  currency: z.number(),
});
export type PostType = z.infer<typeof currencySchema>;
