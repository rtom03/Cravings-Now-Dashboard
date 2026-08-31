import React, { useState } from "react";
import FieldStack from "../../shared/FieldStack";
import TextInput from "../../shared/TextInput";

const SeoTab = () => {
  const [form, setForm] = useState("");

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
      <p className="text-[13px] text-slate-500">
        Improve your discoverability on search engines by providing meta names
        and descriptions
      </p>

      <div className="max-w-xl space-y-4">
        <FieldStack label="Meta Name">
          <TextInput
            placeholder="Meta Name"
            value={form}
            // onChange={setField("title")}
          />
        </FieldStack>

        <FieldStack label="Meta Description">
          <TextInput
            placeholder="Meta Description"
            value={""}
            // onChange={setField("message")}
          />
        </FieldStack>

        <button className="rounded-md bg-sky-500 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
          Save
        </button>
      </div>
    </div>
  );
};

export default SeoTab;
