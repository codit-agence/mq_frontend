"use client";

export function LocaleToggle({
  locale,
  onChange,
}: {
  locale: "fr" | "ar";
  onChange: (locale: "fr" | "ar") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("fr")}
        className={`px-3 py-1.5 text-xs font-black rounded-full transition ${locale === "fr" ? "bg-slate-900 text-white" : "text-slate-600"}`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => onChange("ar")}
        className={`px-3 py-1.5 text-xs font-black rounded-full transition ${locale === "ar" ? "bg-slate-900 text-white" : "text-slate-600"}`}
      >
        AR
      </button>
    </div>
  );
}
