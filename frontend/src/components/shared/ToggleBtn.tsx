// ─── Toggle component ──────────────────────────────────────────────────────────

interface TopbarToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
}

const TopbarToggle = ({ on, onChange }: TopbarToggleProps) => (
  <button
    role="switch"
    aria-checked={on}
    aria-label={on ? "Switch to light mode" : "Switch to dark mode"}
    onClick={() => onChange(!on)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      marginLeft: 10,
    }}
  >
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 36,
        height: 20,
        borderRadius: 999,
        backgroundColor: on ? "#1D9E75" : "#B4B2A9",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          left: 2,
          transition: "transform 0.2s",
          transform: on ? "translateX(16px)" : "translateX(0px)",
        }}
      />
    </span>
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: on ? "#0F6E56" : "#888780",
        transition: "color 0.2s",
        userSelect: "none",
      }}
    >
      {on ? "Dark" : "Light"}
    </span>
  </button>
);

export default TopbarToggle;
