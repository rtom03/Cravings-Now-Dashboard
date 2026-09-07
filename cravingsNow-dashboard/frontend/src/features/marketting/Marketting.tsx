import React, { useState } from "react";
import { PageToolbar } from "../../shared/PageToolBar";
import { Package } from "lucide-react";

const Marketting = () => {
  const SUB_TABS = [
    "Coupons",
    "Promotions",
    "Popup Banner",
    "Campaigns",
    "Mobile Notifications",
  ] as const;

  type SubTab = (typeof SUB_TABS)[number];

  const [subTab, setSubTab] = useState<SubTab>("Coupons");
  const [query, setQuery] = useState("");

  return (
    <div>
      <PageToolbar
        title="Products"
        icon={Package}
        tabs={SUB_TABS.map((key) => ({ key, label: key }))}
        activeTab={subTab}
        onTabChange={setSubTab}
        searchValue={query}
        onSearchChange={setQuery}
        onFilterClick={() => {
          /* wire to a real advanced-filter panel when one exists */
        }}
        onActionsClick={() => {
          /* wire to a real actions menu when one exists */
        }}
      />
    </div>
  );
};

export default Marketting;
