import React from "react";
import Modal, { ModalTabProps } from "../../shared/Modal";
import { useProductDetails } from "../../api/productQuery";
import { CalendarClock, Clock, MapPin, Megaphone, Package } from "lucide-react";
import ProductsCatalog from "../branches/ProductsCatalog";
import WorkingHoursTab from "../branches/WorkingHoursTab";
import DeliveryAreasTab from "../branches/Deliveryareatab";
import Options from "./Options";
import ItemsTab from "./ItemsTab";
import ConfirmationMessageTab from "./ConfirmationMessageTab";
import SeoTab from "./SeoTab";
import ProductOptionsTab from "./Options";
import Availability from "./Availability";
import Branches from "./Branches";

type ProductTabKey =
  | "items"
  | "settings"
  | "availability"
  | "options"
  | "confirm"
  | "seo"
  | "branches";

const ProductDetailsModal = ({
  productId,
  open,
  setOpen,
}: {
  productId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const {
    data: productDetails,
    isPending,
    isError,
  } = useProductDetails(productId);
  const TABS = [
    {
      key: "items",
      label: "Item",
      content: <ItemsTab itemDetails={productDetails!} />,
    },
    // {
    //   key: "settings",
    //   label: "Settings",
    //   content: (
    //     <ProductOptionsTab
    //       groupProductModifiers={productDetails?.groupProductModifiers!}
    //     />
    //   ),
    // },
    {
      key: "availability",
      label: "Availability",
      content: <Availability />,
    },
    {
      key: "options",
      label: "Options",
      content: (
        <ProductOptionsTab
          groupProductModifiers={productDetails?.groupProductModifiers!}
        />
      ),
    },
    {
      key: "confirm",
      label: "Confirmations Message",
      content: <ConfirmationMessageTab />,
    },
    {
      key: "seo",
      label: "Seo",
      content: <SeoTab />,
    },
    {
      key: "branches",
      label: "Branches",
      content: <Branches />,
    },
  ] as const satisfies ModalTabProps<ProductTabKey>[];
  return (
    <Modal<ProductTabKey>
      open={open}
      setOpen={setOpen}
      isLoading={isPending}
      isError={isError}
      title={productDetails?.name ?? ""}
      subtitle="Manage catalog, hours, delivery and messaging for this location"
      tabs={TABS!}
    />
  );
};

export default ProductDetailsModal;
