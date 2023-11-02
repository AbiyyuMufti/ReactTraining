export interface Agenda {
  id: string;
  agenda: string;
  priority: number;
}

export interface AgendaData extends Agenda {
  date: Date;
  description: string;
}

export interface CalendarItem {
  id: number;
  date: Date;
  weekend: boolean;
  empty: boolean;
  agenda: Agenda[];
}

export interface AgendaEntry {
  title: string;
  priority: string;
  description: string;
  date: string;
}
