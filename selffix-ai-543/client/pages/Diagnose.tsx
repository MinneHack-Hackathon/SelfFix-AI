import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, Mic, MicOff, Upload, X, Zap } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { ImageUploader } from "@/components/ImageUploader";

interface DiagnosisData {
  appliance_type: string;
  selected_symptoms: string[];
  custom_description: string;
  image: File | null;
}

const APPLIANCES = [
  "Refrigerator",
  "Washing Machine",
  "Dishwasher",
  "AC Unit",
  "Microwave",
  "Oven",
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

export default function Diagnose() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<DiagnosisData>({
    appliance_type: "",
    selected_symptoms: [],
    custom_description: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const symptoms = formData.appliance_type
    ? SYMPTOMS_MAP[formData.appliance_type] || []
    : [];

  const handleApplianceChange = (value: string) => {
    setFormData({
      ...formData,
      appliance_type: value,
      selected_symptoms: [], // Reset symptoms when appliance changes
    });
  };

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_symptoms: prev.selected_symptoms.includes(symptom)
        ? prev.selected_symptoms.filter((s) => s !== symptom)
        : [...prev.selected_symptoms, symptom],
    }));
  };

  const handleVoiceTranscript = (transcript: string) => {
    setVoiceTranscript(transcript);
    if (transcript) {
      setFormData((prev) => ({
        ...prev,
        custom_description:
          prev.custom_description +
          (prev.custom_description ? " " : "") +
          transcript,
      }));
    }
  };

  const handleImageUpload = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleAnalysis = async () => {
    if (!formData.appliance_type) {
      alert("Please select an appliance type");
      return;
    }

    if (formData.selected_symptoms.length === 0) {
      alert("Please select at least one symptom");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const analysisData = {
        appliance_type: formData.appliance_type,
        selected_symptoms: formData.selected_symptoms,
        custom_description: formData.custom_description,
        has_image: !!formData.image,
      };

      // Mock API response
      const mockResponse = {
        diagnosis: {
          most_likely_issue: "Evaporator Fan Motor Failure",
          confidence_percent: 74,
          severity: "High",
        },
        cost_analysis: {
          estimated_repair_cost: 40,
          estimated_replacement_cost: 900,
          estimated_savings: 860,
        },
        environmental_impact: {
          carbon_saved_kg: 390,
        },
        repair_details: {
          difficulty_level: "Moderate",
          tools_required: ["Screwdriver", "Replacement fan motor"],
          steps: [
            "Unplug refrigerator from power outlet",
            "Remove the rear access panel (usually 4-6 screws)",
            "Disconnect the faulty fan motor from the housing",
            "Install the new fan motor in the same position",
            "Reassemble the panel and test for proper operation",
          ],
          safety_warning:
            "Always unplug before servicing. Do not attempt if you're not comfortable with basic mechanical tasks.",
        },
      };

      // Store result in localStorage
      localStorage.setItem("diagnosisResult", JSON.stringify(mockResponse));

      // Navigate to results page
      navigate("/result");
    } catch (error) {
      console.error("Error analyzing:", error);
      alert("Error performing analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            <span>← Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900">SelfFix AI</span>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Diagnose Your Appliance
          </h1>
          <p className="text-slate-600">
            Answer a few questions about your appliance issue to get an instant diagnosis.
          </p>
        </div>

        <div className="space-y-8">
          {/* Appliance Selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Select Appliance Type
            </label>
            <div className="relative">
              <select
                value={formData.appliance_type}
                onChange={(e) => handleApplianceChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg appearance-none bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose an appliance...</option>
                {APPLIANCES.map((appliance) => (
                  <option key={appliance} value={appliance}>
                    {appliance}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Symptoms */}
          {symptoms.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <label className="block text-sm font-semibold text-slate-900 mb-6">
                What's happening? (Select all that apply)
              </label>
              <div className="space-y-3">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selected_symptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="w-5 h-5 rounded border-slate-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                      {symptom}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Text Description */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Optional: Describe the issue in your own words
            </label>
            <textarea
              value={formData.custom_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  custom_description: e.target.value,
                })
              }
              placeholder="Provide any additional details that might help with the diagnosis..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Voice Recorder */}
          <VoiceRecorder onTranscript={handleVoiceTranscript} />

          {/* Image Uploader */}
          <ImageUploader onImageUpload={handleImageUpload} />

          {/* Confirmation of selected image */}
          {formData.image && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700 font-medium">
                ✓ Image uploaded: {formData.image.name}
              </p>
            </div>
          )}

          {/* Analysis Button */}
          <button
            onClick={handleAnalysis}
            disabled={isLoading || !formData.appliance_type}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyzing...
              </>
            ) : (
              "Start Analysis"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
