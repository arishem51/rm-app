import { ZoneDTO } from "@/types/Api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  selectedZones?: number[];
  zones: ZoneDTO[];
  onChange: (value: number) => void;
  value?: number;
};

const SelectAvailableZones = ({
  selectedZones,
  zones,
  onChange,
  value: formFieldValue,
}: Props) => {
  const groupZoneByWarehouseId = zones.reduce(
    (acc, zone) => {
      if (!acc[zone.warehouseId!]) {
        acc[zone.warehouseId!] = {
          warehouseId: zone.warehouseId!,
          warehouseName: zone.warehouseName,
          zones: [zone],
        };
      } else {
        acc[zone.warehouseId!].zones.push(zone);
      }
      return acc;
    },
    {} as Record<
      number,
      { warehouseId: number; warehouseName?: string; zones: ZoneDTO[] }
    >
  );

  return (
    <Select
      onValueChange={(value) => {
        onChange(parseInt(value));
      }}
      value={formFieldValue?.toString()}
    >
      <SelectTrigger>
        <SelectValue placeholder="Chọn kho - khu trong kho" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupZoneByWarehouseId).map(([key, value]) => {
          const filterAvailableZone = (zone: ZoneDTO) => {
            const selectedZoneId = formFieldValue;
            const renderZoneId = zone.id!;
            const shouldRenderZoneSelected =
              selectedZoneId === renderZoneId ||
              !selectedZones?.includes(renderZoneId);

            return shouldRenderZoneSelected;
          };

          const filteredZones = value.zones.filter(filterAvailableZone) ?? [];

          return (
            <SelectGroup key={key}>
              <SelectLabel>Tên Kho: {value.warehouseName}</SelectLabel>
              {filteredZones.length > 0 ? (
                filteredZones.map((zone) => {
                  const id = zone.id!.toString();
                  return (
                    <SelectItem key={id} value={id.toString()} className="ml-2">
                      {zone.warehouseName} - {zone.name}
                    </SelectItem>
                  );
                })
              ) : (
                <span className="ml-3 text-xs text-gray-600">
                  Kho hàng này không còn khu vực nào khả dụng
                </span>
              )}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SelectAvailableZones;
