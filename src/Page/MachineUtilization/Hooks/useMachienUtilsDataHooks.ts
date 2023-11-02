import {
  // QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getDepartmentList,
  getPlantList,
  getSiteList,
  getWorkCenterList,
  getWorkStationList,
  searchMachineData,
} from "../API/MachineUtilsAPI";
import {
  DepartmentType,
  PlantType,
  SiteType,
  TMachineSearchParameter,
} from "../Type/MachineUtilsPosts";
import { useReducer } from "react";

type TDropdownList = {
  key: string;
  value: string;
};

type TMachineUtilsState = {
  selectedSite?: number | null;
  site_list?: TDropdownList[];

  selectedPlant?: number | null;
  plant_list?: TDropdownList[];

  selectedDepartment?: number | null;
  department_list?: TDropdownList[];

  selectedWorkCenter?: number[] | null;
  work_center_list?: TDropdownList[];

  selectedWorkStation?: number[] | null;
  work_station_list?: TDropdownList[];
};

type TMachineUtilsAction = {
  type:
    | "site-list-fetched"
    | "plant-list-fetched"
    | "department-list-fetched"
    | "work-center-list-fetched"
    | "work-station-list-fetched"
    | "select-department"
    | "select-work-center"
    | "select-work-station";
  payload?: TMachineUtilsState;
};

function machineUtilsDispatcher(
  state: TMachineUtilsState,
  action: TMachineUtilsAction
): TMachineUtilsState {
  console.log(action.type);
  switch (action.type) {
    case "site-list-fetched":
      return {
        ...state,
        site_list: action.payload!.site_list,
        selectedSite: action.payload!.selectedSite,
        selectedPlant: null,
      };
    case "plant-list-fetched":
      return {
        ...state,
        plant_list: action.payload!.plant_list,
        selectedPlant: action.payload!.selectedPlant,
        // selectedDepartment: null,
      };
    case "department-list-fetched":
      return {
        ...state,
        selectedDepartment: action.payload!.selectedDepartment,
        department_list: action.payload!.department_list,
        // selectedWorkCenter: null,
      };
    case "work-center-list-fetched":
      return {
        ...state,
        selectedWorkCenter: action.payload!.selectedWorkCenter,
        work_center_list: action.payload!.work_center_list,
        // selectedWorkStation: null,
      };
    case "work-station-list-fetched":
      return {
        ...state,
        selectedWorkStation: action.payload!.selectedWorkStation,
        work_center_list: action.payload!.work_station_list,
      };

    case "select-department":
      return {
        ...state,
        selectedDepartment: action.payload!.selectedDepartment,
      };
    case "select-work-center":
      return {
        ...state,
        selectedWorkCenter: action.payload!.selectedWorkCenter,
      };
    case "select-work-station":
      return {
        ...state,
        selectedWorkStation: action.payload!.selectedWorkStation,
      };
    default:
      break;
  }
  return state;
}

// const initialState: TMachineUtilsState = ;

export default function useMachineUtilsDataHooks() {
  const query = useQueryClient();
  const [state, dispatch] = useReducer(machineUtilsDispatcher, {
    selectedSite: null,
    selectedPlant: null,
    selectedDepartment: null,
    selectedWorkCenter: null,
    selectedWorkStation: null,
    site_list: [],
    plant_list: [],
    department_list: [],
    work_center_list: [],
    work_station_list: [],
  });

  console.log(state);

  const querySite = useQuery({
    queryKey: ["getSiteList"],
    queryFn: async (): Promise<SiteType[] | null> => {
      const data = await getSiteList();
      const site_list = data?.map((s) => ({
        value: s.ID.toString(),
        key: s.siteName,
      }));
      dispatch({
        type: "site-list-fetched",
        payload: {
          site_list,
          selectedSite: site_list ? Number(site_list[0]?.value) : null,
        },
      });
      return data;
    },
  });

  const { selectedSite, selectedPlant } = state;

  const queryPlant = useQuery({
    queryKey: ["getPlantList", selectedSite],
    enabled: !!selectedSite,
    queryFn: async (): Promise<PlantType[] | null> => {
      const data = await getPlantList(selectedSite!);
      const plant_list = data?.map((p) => ({
        value: p.ID.toString(),
        key: p.plantArea,
      }));

      dispatch({
        type: "plant-list-fetched",
        payload: {
          plant_list,
          selectedPlant: plant_list ? Number(plant_list[0]?.value) : null,
        },
      });
      return data;
    },
  });

  const departmentQuery = useQuery({
    queryKey: ["getDepartmentList", selectedPlant],
    enabled: !!selectedPlant,
    queryFn: async (): Promise<DepartmentType[] | null> => {
      const data = await getDepartmentList(selectedPlant!);
      const department_list = data?.map((d) => ({
        value: d.ID.toString(),
        key: d.department,
      }));
      dispatch({
        type: "department-list-fetched",
        payload: {
          department_list,
        },
      });
      return data;
    },
  });

  const workCenterQuery = useQuery({
    queryKey: ["getWorkCenterList", [state.selectedDepartment]],
    enabled: !!state.selectedDepartment,
    queryFn: async () => {
      const data = await getWorkCenterList([state.selectedDepartment!]);
      const work_center_list = data?.map((wc) => ({
        value: wc.ID.toString(),
        key: wc.workCenter,
      }));
      dispatch({
        type: "work-center-list-fetched",
        payload: {
          work_center_list,
        },
      });
      return data;
    },
  });

  const workStationQuery = useQuery({
    queryKey: ["getWorkStationList", state.selectedWorkCenter],
    queryFn: async () => {
      const data = await getWorkStationList(state.selectedWorkCenter || []);
      const work_station_list = data?.map((ws) => ({
        value: ws.ID.toString(),
        key: ws.workStation,
      }));
      dispatch({
        type: "work-station-list-fetched",
        payload: {
          work_station_list,
        },
      });
      return data;
    },
    enabled: !!state.selectedWorkCenter,
  });

  const searchQuery = useMutation({
    mutationFn: async () => {
      const payload: TMachineSearchParameter = {
        site: state.selectedSite!,
        plant_area_id: state.selectedPlant!,
        department: state.selectedDepartment!,
        work_centers: state.selectedWorkCenter || [],
        work_stations: state.selectedWorkStation || [],
        start_date: new Date(),
        end_date: new Date(),
      };
      return await searchMachineData(payload);
    },
  });

  return {
    query,
    state,
    dispatch,
    searchQuery,
    queries: {
      querySite,
      queryPlant,
      departmentQuery,
      workCenterQuery,
      workStationQuery,
    },
  };
}
