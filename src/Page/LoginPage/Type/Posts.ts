import { z } from "zod";

export const authSchema = z.object({
  authentication: z.boolean(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});
export type AuthType = z.infer<typeof authSchema>;

export type TUserID = {
  id: string;
};
export type TSignUpPayload = TUserID & {
  name: string;
  position: string;
  country: string;
};
