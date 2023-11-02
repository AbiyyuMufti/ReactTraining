import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DepartmentType,
  PlantType,
  SiteType,
  TMachineSearchParameter,
} from "../Type/MachineUtilsPosts";
import {
  downloadData,
  getDepartmentList,
  getPlantList,
  getSiteList,
  getWorkCenterList,
  getWorkStationList,
  searchMachineData,
} from "../API/MachineUtilsAPI";

type TDropdownList = {
  key: string;
  value: string;
};

export default function useMachineDataDropdown() {
  const [site_list, setSiteList] = useState<TDropdownList[]>([]);
  const [selectedSite, setSelectedSite] = useState<number | null>(null);

  const [plant_list, setPlantList] = useState<TDropdownList[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);

  const [department_list, setDepartmentList] = useState<TDropdownList[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );

  const [work_center_list, setWorkCenterList] = useState<TDropdownList[]>([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<number[] | null>(
    null
  );

  const [work_station_list, setWorkStationList] = useState<TDropdownList[]>([]);
  const [selectedWorkStation, setSelectedWorkStation] = useState<
    number[] | null
  >(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const siteRef = useRef<HTMLSelectElement>(null);
  const plantRef = useRef<HTMLSelectElement>(null);
  const departmentRef = useRef<HTMLSelectElement>(null);

  const querySite = useQuery({
    queryKey: ["getSiteList"],
    queryFn: async (): Promise<SiteType[] | null> => {
      const data = await getSiteList();
      setSiteList(
        data?.map((s) => ({
          value: s.ID.toString(),
          key: s.siteName,
        })) || []
      );
      return data;
    },
  });

  const { isFetched: siteIsFetched } = querySite;
  useEffect(() => {
    if (siteIsFetched) {
      setSelectedSite(Number(siteRef.current!.selectedOptions[0]?.value));
    }
  }, [siteIsFetched]);

  const queryPlant = useQuery({
    queryKey: ["getPlantList", selectedSite],
    enabled: !!selectedSite,
    queryFn: async (): Promise<PlantType[] | null> => {
      const data = await getPlantList(selectedSite!);
      setPlantList(
        data?.map((p) => ({
          value: p.ID.toString(),
          key: p.plantArea,
        })) || []
      );
      return data;
    },
  });

  const { isFetched: plantIsFetched } = queryPlant;
  useEffect(() => {
    if (plantIsFetched) {
      setSelectedPlant(Number(plantRef.current!.selectedOptions[0]?.value));
    }
  }, [plantIsFetched]);

  const departmentQuery = useQuery({
    queryKey: ["getDepartmentList", selectedPlant],
    enabled: !!selectedPlant,
    queryFn: async (): Promise<DepartmentType[] | null> => {
      const data = await getDepartmentList(selectedPlant!);
      setDepartmentList(
        data?.map((d) => ({
          value: d.ID.toString(),
          key: d.department,
        })) || []
      );
      return data;
    },
  });

  const { isFetched: departmentIsFetched } = departmentQuery;
  useEffect(() => {
    if (departmentIsFetched) {
      setSelectedDepartment(
        Number(departmentRef.current!.selectedOptions[0]?.value)
      );
    }
  }, [departmentIsFetched]);

  const workCenterQuery = useQuery({
    queryKey: ["getWorkCenterList", [selectedDepartment]],
    enabled: !!selectedDepartment,
    queryFn: async () => {
      const data = await getWorkCenterList([selectedDepartment!]);
      setWorkCenterList(
        data?.map((wc) => ({
          value: wc.ID.toString(),
          key: wc.workCenter,
        })) || []
      );
      return data;
    },
  });

  const workStationQuery = useQuery({
    queryKey: ["getWorkStationList", selectedWorkCenter],
    enabled: !!selectedWorkCenter,
    queryFn: async () => {
      console.log("fetching because ", selectedWorkCenter);
      const data = await getWorkStationList(selectedWorkCenter || []);
      setWorkStationList(
        data?.map((ws) => ({
          value: ws.ID.toString(),
          key: ws.workStation,
        })) || []
      );
      return data;
    },
  });

  const searchQuery = useMutation({
    mutationFn: async () => {
      const offset_one_day = 24 * 60 * 60 * 1000;
      const start_date = new Date(selectedDate!.getTime());
      start_date.setHours(0, 0, 0, 0);
      const end_date = new Date(start_date!.getTime() + offset_one_day);
      const payload: TMachineSearchParameter = {
        site: selectedSite!,
        plant_area_id: selectedPlant!,
        department: selectedDepartment!,
        work_centers: selectedWorkCenter || [],
        work_stations: selectedWorkStation || [],
        start_date: start_date,
        end_date: end_date,
      };
      console.log(payload);
      return await searchMachineData(payload);
    },
  });

  const commandDownload = useMutation({
    mutationFn: async () => {
      const offset_one_day = 24 * 60 * 60 * 1000;
      const start_date = new Date(selectedDate!.getTime());
      start_date.setHours(0, 0, 0, 0);
      const end_date = new Date(start_date!.getTime() + offset_one_day);
      const payload: TMachineSearchParameter = {
        site: selectedSite!,
        plant_area_id: selectedPlant!,
        department: selectedDepartment!,
        work_centers: selectedWorkCenter || [],
        work_stations: selectedWorkStation || [],
        start_date: start_date,
        end_date: end_date,
      };
      return await downloadData(payload);
    },
  });

  return {
    searchQuery,
    siteRef,
    plantRef,
    departmentRef,
    commandDownload,
    queries: {
      querySite,
      queryPlant,
      departmentQuery,
      workCenterQuery,
      workStationQuery,
    },
    site_list,
    plant_list,
    department_list,
    work_center_list,
    work_station_list,
    setSelectedSite,
    setSelectedPlant,
    setSelectedDepartment,
    setSelectedWorkCenter,
    setSelectedWorkStation,
    setSelectedDate,
  };
}
