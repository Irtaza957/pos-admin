import { Dropdown } from "@/components/common/Dropdown";
import FiltersLayout from "@/components/common/FiltersLayout";
import { Input } from "@/components/ui/input";
import { useFetchStoresQuery } from "@/features/store/services/branches";
import { useUpdateOrderMutation } from "@/features/store/services/order";
import { BranchType, OrderFilterType } from "@/lib/types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface CustomerFilterProps {
  filterData: OrderFilterType;
  handleFilter: (filters: OrderFilterType) => void;
  handleResetFilter: () => void;
  setOpenFilter: Dispatch<SetStateAction<boolean>>;
  openFilter: boolean;
}

export default function OrdersFilter({ filterData, handleFilter, handleResetFilter, setOpenFilter, openFilter }: CustomerFilterProps) {
  const [filter, setFilter] = useState<OrderFilterType>({
    name: "",
    store: "",
    price: "",
    status: "",
    orderStatus: "",
    date: "",
  });

  const [updateOrder] = useUpdateOrderMutation();

  const { data: storeData } = useFetchStoresQuery(
    {},
    {
      skip: !openFilter,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleApplyFilter = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleFilter(filter);

    // Update order if status is selected
    if (filter.status) {
      const payload = {
        id: filterData.id, // Assuming filterData contains the order ID
        data: {
          /* other data to update */
        },
        status: filter.status,
      };

      try {
        await updateOrder(payload).unwrap();
        // Optionally, you can show a success message or handle the response
      } catch (error) {
        console.error("Failed to update order:", error);
        // Optionally, show an error message
      }
    }
  };

  useEffect(() => {
    setFilter(filterData);
  }, [filterData]);

  return (
    <FiltersLayout handleResetFilter={handleResetFilter} handleApplyFilter={handleApplyFilter} setOpenFilter={setOpenFilter}>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Input id="name" label="Name" placeholder="Enter name" value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Dropdown
            label="Store"
            options={storeData?.data?.map((store: BranchType) => ({ value: store.id, label: store.name }))}
            value={filter.store}
            onChange={(value) => setFilter({ ...filter, store: value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Input id="price" label="Price" placeholder="Enter price" value={filter.price} onChange={(e) => setFilter({ ...filter, price: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Input id="status" label="Status" placeholder="Enter status" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
        </div>
      </div>
    </FiltersLayout>
  );
}
