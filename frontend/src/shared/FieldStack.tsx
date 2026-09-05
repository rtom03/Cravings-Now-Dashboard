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

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-[13px] font-medium text-slate-300">
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
export { FieldStack, FieldRow };
