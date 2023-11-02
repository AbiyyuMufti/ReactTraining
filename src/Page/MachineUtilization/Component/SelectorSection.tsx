import Button from "../../../Component/ReusableComponent/Button";
import DatePickerCustom from "../../../Component/ReusableComponent/DatePickerCustom";
import DropdownSelector from "../../../Component/ReusableComponent/DropdownSelector";
import FilterIcon from "../../../Media/Image/filter-icon.png";
import ExportIcon from "../../../Media/Image/export-icon.PNG";
import DropdownCustom from "../../../Component/ReusableComponent/DropdownCustom";
import useMachineDataDropdown from "../Hooks/useMachineDataDropdown";
import DropdownArrow2 from "../../../Media/Image/Dropdown-Arrow2.png";
import { MachineDataType } from "../Type/MachineUtilsPosts";
// import { useQueryClient } from "@tanstack/react-query";

export default function SelectorSection(props: {
  onSearch: (data: MachineDataType[]) => void;
}) {
  const {
    searchQuery,
    siteRef,
    plantRef,
    departmentRef,
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
    commandDownload,
  } = useMachineDataDropdown();

  // const client = useQueryClient();
  return (
    <form
      className="mu-main__selector"
      onSubmit={(e) => {
        e.preventDefault();
        searchQuery.mutateAsync().then((value) => {
          props.onSearch(value || []);
        });
      }}
    >
      <Button customClass="button-with-image">
        <img src={FilterIcon} alt="" />
      </Button>
      <DropdownCustom
        ref={siteRef}
        className="mu-dropdown"
        name="site"
        label="Site:"
        options={site_list}
        onSelectionChange={(data) => setSelectedSite(Number(data))}
      />
      <DropdownSelector
        ref={plantRef}
        className="mu-dropdown"
        name="plant_area_id"
        label="Plant:"
        options={plant_list}
        onSelectionChange={(data) => setSelectedPlant(Number(data))}
      />
      <DropdownCustom
        ref={departmentRef}
        className="mu-dropdown"
        name="department"
        label="Department:"
        options={department_list}
        onSelectionChange={(data) => setSelectedDepartment(Number(data))}
      />
      <DropdownCustom
        className="mu-dropdown work-center"
        name="work_centers"
        label="Work Center:"
        options={work_center_list}
        isMultiple={true}
        onSelectionChange={(data) => {
          setSelectedWorkCenter(data);
          // client.invalidateQueries(["getWorkStationList"]);
        }}
        dropdownImage={DropdownArrow2}
      />
      <DropdownCustom
        className="mu-dropdown"
        name="work_stations"
        label="Workstation:"
        options={work_station_list}
        isMultiple={true}
        onSelectionChange={(data) => setSelectedWorkStation(data)}
        dropdownImage={DropdownArrow2}
      />
      <Button customClass="search-button" type="submit">
        SEARCH
      </Button>
      <Button
        customClass="button-with-image"
        onClickHandler={() => commandDownload.mutateAsync()}
      >
        <img src={ExportIcon} alt="export" />
      </Button>
      <DatePickerCustom
        onSelectionChanged={(date) => setSelectedDate(date)}
      ></DatePickerCustom>
    </form>
  );
}
