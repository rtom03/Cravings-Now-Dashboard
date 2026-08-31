import { useState } from "react";
import TextInput from "../../shared/TextInput";
import FieldStack from "../../shared/FieldStack";

// ─── Shared primitives (same conventions as GeneralTab / ProductDetailsTab) ─

function ToggleSwitch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0f14] ${
        on ? "bg-sky-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-out ${
          on ? "translate-x-[20px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

// ─── Reference data — taken directly from the screenshots, Arabic fields excluded ──

interface ConfirmationMessageForm {
  showConfirmation: boolean;
  title: string;
  message: string;
  agreeButtonText: string;
  cancelButtonText: string;
}

const INITIAL_FORM: ConfirmationMessageForm = {
  showConfirmation: false,
  title: "",
  message: "",
  agreeButtonText: "I confirm",
  cancelButtonText: "Cancel",
};

// ─── Tab ────────────────────────────────────────────────────────────────────

export default function ConfirmationMessageTab() {
  const [form, setForm] = useState<ConfirmationMessageForm>(INITIAL_FORM);

  const setField =
    (key: keyof Omit<ConfirmationMessageForm, "showConfirmation">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
      <p className="text-[13px] text-slate-500">
        A confirmation message is a pop-up message that shows to the customer
        before adding the product to cart
      </p>

      <div className="flex items-center gap-3">
        <ToggleSwitch
          on={form.showConfirmation}
          onChange={(v) =>
            setForm((prev) => ({ ...prev, showConfirmation: v }))
          }
        />
        <span className="text-[13px] text-slate-200">
          Show confirmation message
        </span>
      </div>

      <div className="max-w-xl space-y-4">
        <FieldStack label="Title">
          <TextInput
            placeholder="Title"
            value={form.title}
            onChange={setField("title")}
          />
        </FieldStack>

        <FieldStack label="Message">
          <TextInput
            placeholder="Message"
            value={form.message}
            onChange={setField("message")}
          />
        </FieldStack>

        <FieldStack label="Agree button text">
          <TextInput
            value={form.agreeButtonText}
            onChange={setField("agreeButtonText")}
          />
        </FieldStack>

        <FieldStack label="Cancel button text">
          <TextInput
            value={form.cancelButtonText}
            onChange={setField("cancelButtonText")}
          />
        </FieldStack>

        <button className="rounded-md bg-sky-500 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-sky-400">
          Save
        </button>
      </div>
    </div>
  );
}
