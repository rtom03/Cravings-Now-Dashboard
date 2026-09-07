import React from "react";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-white/10 bg-[#12151b] px-3 py-2.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-sky-500/60 focus:outline-none"
    />
  );
}

export default TextInput;
