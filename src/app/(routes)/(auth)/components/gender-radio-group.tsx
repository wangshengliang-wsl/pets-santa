import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const options = [
  { id: "male", label: "Male", value: false, icon: "👨" },
  { id: "female", label: "Female", value: true, icon: "👩" },
];

export function GenderRadioGroup({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={(val) => onChange(val === "true")}
      className="grid grid-cols-2 gap-3 mt-2"
    >
      {options.map((opt) => (
        <div
          key={opt.id}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-4 py-3 border-2 cursor-pointer transition-all duration-300",
            value === opt.value
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-sm"
              : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600",
          )}
          onClick={() => onChange(opt.value)}
        >
          <RadioGroupItem
            id={opt.id}
            value={String(opt.value)}
            className="peer sr-only"
          />
          <span className="text-lg">{opt.icon}</span>
          <Label
            htmlFor={opt.id}
            className="cursor-pointer text-sm font-semibold"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
