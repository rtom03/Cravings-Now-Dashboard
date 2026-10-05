const navItems = [
  { to: "/", icon: "ti-layout-dashboard", label: "Home" },
  // { to: "/pos", icon: "ti-building", label: "Pos" },
  { to: "/branches", icon: "ti-chart-bar", label: "Branches" },
  { to: "/products", icon: "ti-receipt", label: "Products" },
  { to: "/orders", icon: "ti-user", label: "Orders" },
  { to: "/customers", icon: "ti-database", label: "Customers" },
  { to: "/reports", icon: "ti-settings", label: "Reports" },
  { to: "/marketting", icon: "ti-device-laptop", label: "Marketting" },
  { to: "/add-ons", icon: "ti-device-laptop", label: "Add-Ons" },
  {
    to: "/qa",
    icon: "ti-file-analytics",
    label: "Q&A",
  },
  { to: "/help", icon: "ti-device-laptop", label: "Help" },
];

const isBranchOpen = (openingFrom: string, openingTo: string): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [fromH, fromM] = openingFrom.split(":").map(Number);
  const [toH, toM] = openingTo.split(":").map(Number);
  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;

  // Special case: "00:00" to "00:00" means open 24 hours
  if (fromMinutes === toMinutes) {
    return true;
  }

  // Overnight range, e.g. opening_from: "18:00", opening_to: "02:00"
  if (toMinutes < fromMinutes) {
    return currentMinutes >= fromMinutes || currentMinutes < toMinutes;
  }

  // Normal same-day range
  return currentMinutes >= fromMinutes && currentMinutes < toMinutes;
};

export { navItems, isBranchOpen };
