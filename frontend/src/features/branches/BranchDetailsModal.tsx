// BranchDetailsModal.tsx
import { CalendarClock, Clock, MapPin, Megaphone, Package } from "lucide-react";
import { useBranch } from "../../api/branchQuery";
import WorkingHoursTab from "./WorkingHoursTab";
import Modal, { ModalTabProps } from "../../shared/Modal";
import DeliveryAreasTab from "./Deliveryareatab";
import ProductsCatalog from "./ProductsCatalog";
import { useEffect } from "react";
import { useBranchStore } from "../../store/branchStore";
// ...other tab content imports

type BranchTabKey = "catalog" | "hours" | "slots" | "areas" | "banner";

export default function BranchDetailsModal({
  branchId,
  open,
  setOpen,
}: {
  branchId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: branch, isPending, isError } = useBranch(branchId);

  const setSelected = useBranchStore((state) => state.setSelectedBranch);
  useEffect(() => {
    if (branch) {
      setSelected(branch);
      // console.log("Branch:", branch);
      // console.log("ID:", id);
    }
  }, [branch, branchId, setSelected]);

  const TABS = [
    {
      key: "catalog",
      label: "Catalog",
      icon: Package,
      content: <ProductsCatalog setOpen={() => false} />,
    },
    {
      key: "hours",
      label: "Working Hours",
      icon: Clock,
      content: <WorkingHoursTab />,
    },
    {
      key: "slots",
      label: "Scheduled Delivery Slots",
      icon: CalendarClock,
      content: <WorkingHoursTab />,
    },
    {
      key: "areas",
      label: "Delivery Areas and Rates",
      icon: MapPin,
      content: <DeliveryAreasTab branchName="icm" />,
    },
    {
      key: "banner",
      label: "Notice Banner",
      icon: Megaphone,
      content: <WorkingHoursTab />,
    },
  ] as const satisfies ModalTabProps<BranchTabKey>[];

  return (
    <Modal<BranchTabKey>
      open={open}
      setOpen={setOpen}
      isLoading={isPending}
      isError={isError}
      title={branch?.name ?? ""}
      subtitle="Manage catalog, hours, delivery and messaging for this location"
      icon={MapPin}
      tabs={TABS!}
    />
  );
}
