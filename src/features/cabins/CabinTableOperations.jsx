import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "no-discount", label: "No discount" },
    { value: "with-discount", label: "With discount" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "regularPrice-asc", label: "Price (low first)" },
    { value: "regularPrice-desc", label: "Price (high first)" },
    { value: "maxCapacity-asc", label: "Capacity (low first)" },
    { value: "maxCapacity-desc", label: "Capacity (high first)" },
  ];

  return (
    <TableOperations>
      <Filter filterField="discount" options={filterOptions} />
      <SortBy options={sortOptions} />
    </TableOperations>
  );
}

export default CabinTableOperations;
