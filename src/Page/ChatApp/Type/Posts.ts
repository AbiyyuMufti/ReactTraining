import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UserType = z.infer<typeof userSchema>;

export type TMessageItem = {
  sender: string;
  timestamp: Date;
  payload: string;
};

export type TMessagePayload = {
  sender: string;
  timestamp: number;
  payload: string;
};

export type TMessageRender = TMessagePayload & {
  read: boolean;
};

export type TMessagingAction = {
  type: string;
  payload?: TMessageItem;
  targetUser: string;
};
