import React from "react";

function FieldStack({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );
}
export default FieldStack;
