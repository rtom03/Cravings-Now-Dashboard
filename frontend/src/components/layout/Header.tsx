import { useEffect, useState } from "react";
import TopbarToggle from "../shared/ToggleBtn";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);
  return (
    <header className="header">
      <div className="search-bar">
        <i className="ti ti-search" />
        <input type="text" placeholder="Search for users, groups or settings" />
      </div>

      <div className="header-right">
        <div className="p-5">
          <TopbarToggle on={darkMode} onChange={setDarkMode} />
        </div>
        <button aria-label="Notifications">
          <i className="ti ti-bell" />
        </button>
        <button aria-label="User">
          <i className="ti ti-user" />
        </button>
      </div>
    </header>
  );
}
