import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Case } from "./CaseTable";

interface CaseFormProps {
  onSubmit: (caseData: Omit<Case, "id" | "date" | "createdAt" | "updatedAt">) => void;
  initialData?: Case;
  isLoading?: boolean;
}

const APPLIANCES = [
  "Refrigerator",
  "Washing Machine",
  "Dishwasher",
  "AC Unit",
  "Microwave",
  "Oven",
];

const BRANDS = [
  "Whirlpool",
  "LG",
  "Samsung",
  "GE",
  "Electrolux",
  "Bosch",
  "Frigidaire",
];

const SYMPTOMS_MAP: Record<string, string[]> = {
  "Refrigerator": [
    "Not cooling",
    "Freezer works, fridge warm",
    "Water leaking",
    "Loud clicking noise",
    "Excess frost buildup",
  ],
  "Washing Machine": [
    "Won't drain",
    "Excessive vibration",
    "Clothes not clean",
    "Water leaking",
    "Won't spin",
  ],
  "Dishwasher": [
    "Dishes not clean",
    "Water leaking",
    "Won't start",
    "Loud grinding noise",
    "Door won't close",
  ],
  "AC Unit": [
    "Not cooling",
    "Weak airflow",
    "Strange noises",
    "Refrigerant leak",
    "Thermostat not responding",
  ],
  "Microwave": [
    "Not heating",
    "Spark in microwave",
    "Turntable not rotating",
    "Buttons not working",
    "Food not cooking evenly",
  ],
  "Oven": [
    "Not heating",
    "Uneven temperature",
    "Won't turn on",
    "Display not working",
    "Door latch broken",
  ],
};

const ROOT_CAUSES = [
  "Evaporator Fan Motor Failure",
  "Compressor Failure",
  "Thermostat Malfunction",
  "Water Valve Failure",
  "Door Seal Leak",
  "Control Board Failure",
  "Motor Relay Failure",
  "Pump Failure",
  "Heating Element Failure",
  "Other",
];

export function CaseForm({ onSubmit, initialData, isLoading }: CaseFormProps) {
  const [formData, setFormData] = useState({
    applianceType: initialData?.applianceType || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    symptoms: initialData?.symptoms || [],
    additionalNotes: initialData?.additionalNotes || "",
    diagnosticSteps: initialData?.diagnosticSteps || [],
    rootCause: initialData?.rootCause || "",
    partReplaced: initialData?.partReplaced || "",
    partCost: typeof initialData?.partCost === 'string' ? parseFloat(initialData.partCost) : (initialData?.partCost || 0),
    laborTimeMinutes: initialData?.laborTimeMinutes || 0,
    diyFeasibility: initialData?.diyFeasibility || ("Easy" as const),
    successful: initialData?.successful !== undefined ? initialData.successful : true,
  });

  const [newStep, setNewStep] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const symptoms = formData.applianceType
    ? SYMPTOMS_MAP[formData.applianceType] || []
    : [];

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const addDiagnosticStep = () => {
    if (newStep.trim()) {
      setFormData((prev) => ({
        ...prev,
        diagnosticSteps: [...prev.diagnosticSteps, newStep],
      }));
      setNewStep("");
    }
  };

  const removeDiagnosticStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diagnosticSteps: prev.diagnosticSteps.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.applianceType)
      newErrors.applianceType = "Appliance type is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (formData.symptoms.length === 0)
      newErrors.symptoms = "At least one symptom is required";
    if (!formData.rootCause) newErrors.rootCause = "Root cause is required";
    if (!formData.partReplaced) newErrors.partReplaced = "Part name is required";
    if (Number(formData.partCost) < 0) newErrors.partCost = "Cost cannot be negative";
    if (formData.laborTimeMinutes < 0)
      newErrors.laborTimeMinutes = "Labor time cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Appliance Type */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Appliance Type *
        </label>
        <select
          value={formData.applianceType}
          disabled={isLoading}
          onChange={(e) =>
            setFormData({ ...formData, applianceType: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.applianceType ? "border-red-300" : "border-slate-300"
            }`}
        >
          <option value="">Select appliance...</option>
          {APPLIANCES.map((app) => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>
        {errors.applianceType && (
          <p className="mt-1 text-sm text-red-600">{errors.applianceType}</p>
        )}
      </div>

      {/* Brand and Model */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Brand *
          </label>
          <select
            value={formData.brand}
            disabled={isLoading}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.brand ? "border-red-300" : "border-slate-300"
              }`}
          >
            <option value="">Select brand...</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Model *
          </label>
          <input
            type="text"
            value={formData.model}
            disabled={isLoading}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="e.g. RF29FMEDBSR"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.model ? "border-red-300" : "border-slate-300"
              }`}
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
          )}
        </div>
      </div>

      {/* Symptoms */}
      {symptoms.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-4">
            Customer Reported Symptoms *
          </label>
          <div className="space-y-3">
            {symptoms.map((symptom) => (
              <label key={symptom} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                  className="w-4 h-4 rounded border-slate-300 text-green-500"
                />
                <span className="text-slate-700">{symptom}</span>
              </label>
            ))}
          </div>
          {errors.symptoms && (
            <p className="mt-3 text-sm text-red-600">{errors.symptoms}</p>
          )}
        </div>
      )}

      {/* Additional Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Additional Notes
        </label>
        <textarea
          value={formData.additionalNotes}
          disabled={isLoading}
          onChange={(e) =>
            setFormData({ ...formData, additionalNotes: e.target.value })
          }
          placeholder="Any additional observations..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>

      {/* Diagnostic Steps */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          Diagnostic Steps Taken
        </label>
        <div className="space-y-3 mb-4">
          {formData.diagnosticSteps.map((step, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700">
                {step}
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => removeDiagnosticStep(index)}
                className="p-2 hover:bg-red-100 rounded-lg text-red-600 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newStep}
            disabled={isLoading}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Enter a diagnostic step..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDiagnosticStep();
              }
            }}
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={addDiagnosticStep}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:bg-green-300"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Root Cause */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Final Root Cause *
        </label>
        <select
          value={formData.rootCause}
          disabled={isLoading}
          onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.rootCause ? "border-red-300" : "border-slate-300"
            }`}
        >
          <option value="">Select root cause...</option>
          {ROOT_CAUSES.map((cause) => (
            <option key={cause} value={cause}>
              {cause}
            </option>
          ))}
        </select>
        {errors.rootCause && (
          <p className="mt-1 text-sm text-red-600">{errors.rootCause}</p>
        )}
      </div>

      {/* Repair Details */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Part Replaced *
          </label>
          <input
            type="text"
            value={formData.partReplaced}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({ ...formData, partReplaced: e.target.value })
            }
            placeholder="e.g. Evaporator Fan Motor"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.partReplaced ? "border-red-300" : "border-slate-300"
              }`}
          />
          {errors.partReplaced && (
            <p className="mt-1 text-sm text-red-600">{errors.partReplaced}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Part Cost ($)
          </label>
          <input
            type="number"
            value={formData.partCost}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({ ...formData, partCost: parseFloat(e.target.value) })
            }
            min="0"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.partCost ? "border-red-300" : "border-slate-300"
              }`}
          />
          {errors.partCost && (
            <p className="mt-1 text-sm text-red-600">{errors.partCost}</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Labor Time (minutes)
          </label>
          <input
            type="number"
            value={formData.laborTimeMinutes}
            disabled={isLoading}
            onChange={(e) =>
              setFormData({
                ...formData,
                laborTimeMinutes: parseInt(e.target.value),
              })
            }
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.laborTimeMinutes ? "border-red-300" : "border-slate-300"
              }`}
          />
          {errors.laborTimeMinutes && (
            <p className="mt-1 text-sm text-red-600">{errors.laborTimeMinutes}</p>
          )}
        </div>
      </div>

      {/* DIY Feasibility */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          DIY Feasibility
        </label>
        <div className="space-y-3">
          {(["Easy", "Moderate", "Professional Required"] as const).map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="diyFeasibility"
                value={level}
                disabled={isLoading}
                checked={formData.diyFeasibility === level}
                onChange={() =>
                  setFormData({ ...formData, diyFeasibility: level })
                }
                className="w-4 h-4 border-slate-300 text-green-500"
              />
              <span className="text-slate-700">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Repair Success */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-4">
          Was this repair successful?
        </label>
        <div className="space-y-3">
          {[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ].map(({ value, label }) => (
            <label key={String(value)} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="successful"
                disabled={isLoading}
                checked={formData.successful === value}
                onChange={() => setFormData({ ...formData, successful: value })}
                className="w-4 h-4 border-slate-300 text-green-500"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          initialData ? "Update Case" : "Submit Case"
        )}
      </button>
    </form>
  );
}
