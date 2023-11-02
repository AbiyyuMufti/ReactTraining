import { z } from "zod";

export const agendaSchema = z.object({
  id: z.string(),
  agenda: z.string(),
  date: z.string(),
  priority: z.string(),
});

export const agendaItemSchema = z.object({
  id: z.string(),
  agenda: z.string(),
  date: z.string(),
  priority: z.string(),
  description: z.string(),
});

export type AgendaType = z.infer<typeof agendaSchema>;
export type AgendaItemType = z.infer<typeof agendaItemSchema>;
