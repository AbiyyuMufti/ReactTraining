import axios from "axios";
import {
  DepartmentSchema,
  DepartmentType,
  // DownloadSchema,
  // DownloadType,
  MachineDataSchema,
  MachineDataType,
  PlantSchema,
  PlantType,
  SiteSchema,
  SiteType,
  WorkCenterSchema,
  WorkCenterType,
  WorkStationSchema,
  WorkStationType,
} from "../Type/MachineUtilsPosts";
import { toast } from "react-toastify";
import { TMachineSearchParameter } from "../Type/MachineUtilsPosts";

export const getSiteList = async () => {
  try {
    const { data }: { data: SiteType[] } = await axios({
      url: "http://localhost:8000/machine-utilization/site",
      method: "GET",
    });

    SiteSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const getPlantList = async (site_id: number) => {
  try {
    const { data }: { data: PlantType[] } = await axios({
      url: "http://localhost:8000/machine-utilization/plant-area/",
      method: "GET",
      params: {
        "site-id": site_id,
      },
    });
    PlantSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const getDepartmentList = async (plant_area_id: number) => {
  try {
    const { data }: { data: DepartmentType[] } = await axios({
      url: "http://localhost:8000/machine-utilization/department/",
      method: "GET",
      params: {
        "plant-area-id": plant_area_id,
      },
    });
    DepartmentSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const getWorkCenterList = async (departments: number[]) => {
  const params = departments
    .map((e) => `dp=${e}`)
    .toString()
    .replace(",", "&");
  try {
    const { data }: { data: WorkCenterType[] } = await axios({
      url: `http://localhost:8000/machine-utilization/work-center/?${params}`,
      method: "GET",
    });
    WorkCenterSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const getWorkStationList = async (work_centers: number[]) => {
  const params = work_centers
    .map((e) => `wc=${e}`)
    .toString()
    .replace(",", "&");
  try {
    const { data }: { data: WorkStationType[] } = await axios({
      url: `http://localhost:8000/machine-utilization/work-station/?${params}`,
      method: "GET",
    });
    WorkStationSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    toast.error(error.message);
    return null;
  }
};

export const searchMachineData = async (payload: TMachineSearchParameter) => {
  try {
    const { data }: { data: MachineDataType[] } = await axios({
      url: `http://localhost:8000/machine-utilization/data`,
      method: "POST",
      data: payload,
    });
    MachineDataSchema.array().parse(data);
    return data;
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    toast.error(error.message);
    return null;
  }
};

export const downloadData = async (payload: TMachineSearchParameter) => {
  try {
    const { data } = await axios({
      url: `http://localhost:8000/machine-utilization/download`,
      method: "POST",
      data: payload,
      responseType: "blob",
    });
    // DownloadSchema.array().parse(data);

    const blob = new Blob([data as any], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up
    document.body.removeChild(a); // Remove the anchor element

    // return data;
    // return null;
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    toast.error(error.message);
    // return null;
  }
};
