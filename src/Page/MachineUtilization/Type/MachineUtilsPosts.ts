import { z } from "zod";

export const SiteSchema = z.object({
  ID: z.number(),
  siteName: z.string(),
});

export type SiteType = z.infer<typeof SiteSchema>;

export const PlantSchema = z.object({
  ID: z.number(),
  plantArea: z.string(),
});

export type PlantType = z.infer<typeof PlantSchema>;

export const DepartmentSchema = z.object({
  ID: z.number(),
  department: z.string(),
});

export type DepartmentType = z.infer<typeof DepartmentSchema>;

export const WorkCenterSchema = z.object({
  ID: z.number(),
  workCenter: z.string(),
});

export type WorkCenterType = z.infer<typeof WorkCenterSchema>;

export const WorkStationSchema = z.object({
  ID: z.number(),
  workStation: z.string(),
});

export type WorkStationType = z.infer<typeof WorkStationSchema>;

export type TMachineSearchParameter = {
  site: number;
  plant_area_id: number;
  department: number;
  work_centers: number[];
  work_stations: number[];
  start_date: Date;
  end_date: Date;
};

export const MachineDataSchema = z.object({
  id: z.number(),
  workStation: z.string(),
  workCenter: z.string(),
  data: z.array(
    z.object({
      x: z.string(),
      y: z.array(z.number()),
    })
  ),
  utilization: z.number(),
});

export type MachineDataType = z.infer<typeof MachineDataSchema>;

export interface TimelineData {
  status: string;
  runtime: [number, number];
}
export interface TimelineChartProps {
  data: TimelineData[];
}

export const DownloadSchema = z.object({
  date: z.string(),
  workCenter: z.string(),
  workStation: z.string(),
  runTimeDurations: z.string(),
  utilization: z.string(),
});

export type DownloadType = z.infer<typeof DownloadSchema>;
