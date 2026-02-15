import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, History, Download, TrendingUp, Clock, DollarSign, Zap } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Case } from "@/components/admin/CaseTable";

// Mock data - in production this would come from a backend
const MOCK_CASES: Case[] = [
  {
    id: 1,
    applianceType: "Refrigerator",
    brand: "Whirlpool",
    model: "RF29FMEDBSR",
    symptoms: ["Not cooling", "Excess frost buildup"],
    additionalNotes: "Customer reported fridge temperature rising",
    diagnosticSteps: ["Checked thermostat", "Tested evaporator fan"],
    rootCause: "Evaporator Fan Motor Failure",
    partReplaced: "Evaporator Fan Motor",
    partCost: "40",
    laborTimeMinutes: 45,
    diyFeasibility: "Moderate",
    successful: true,
    date: "2024-01-14",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    applianceType: "Washing Machine",
    brand: "LG",
    model: "WM4000CW",
    symptoms: ["Won't drain", "Water leaking"],
    additionalNotes: "Water pooling at bottom during cycle",
    diagnosticSteps: ["Inspected drain pump", "Checked hoses"],
    rootCause: "Pump Failure",
    partReplaced: "Drain Pump",
    partCost: "65",
    laborTimeMinutes: 60,
    diyFeasibility: "Moderate",
    successful: true,
    date: "2024-01-13",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    applianceType: "Dishwasher",
    brand: "GE",
    model: "GDT635HSNWS",
    symptoms: ["Dishes not clean"],
    additionalNotes: "Spray arms not rotating properly",
    diagnosticSteps: ["Checked spray arm assembly", "Tested motor"],
    rootCause: "Spray Arm Assembly Blockage",
    partReplaced: "Spray Arm Assembly",
    partCost: "25",
    laborTimeMinutes: 30,
    diyFeasibility: "Easy",
    successful: true,
    date: "2024-01-12",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);

  // Load cases from API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases');
        if (!response.ok) throw new Error('Failed to fetch cases');
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    fetchCases();
  }, []);

  // Calculate statistics
  const totalCases = cases.length;

  const getMostCommonIssue = (): string => {
    if (cases.length === 0) return "N/A";
    const issueCounts: Record<string, number> = {};
    cases.forEach((c) => {
      issueCounts[c.rootCause] = (issueCounts[c.rootCause] || 0) + 1;
    });
    return Object.entries(issueCounts).sort(([, a], [, b]) => b - a)[0][0];
  };

  const getAverageCost = (): number => {
    if (cases.length === 0) return 0;
    const total = cases.reduce((sum, c) => sum + parseFloat(c.partCost || "0"), 0);
    return Math.round(total / cases.length);
  };

  const getAverageLaborTime = (): number => {
    if (cases.length === 0) return 0;
    const total = cases.reduce((sum, c) => sum + c.laborTimeMinutes, 0);
    return Math.round(total / cases.length);
  };

  const handleExportData = () => {
    if (cases.length === 0) {
      alert("No cases to export");
      return;
    }

    // Create CSV header
    const headers = [
      "ID",
      "ApplianceType",
      "Brand",
      "Model",
      "RootCause",
      "PartCost",
      "LaborTime",
      "DIYFeasibility",
      "Successful",
      "Date",
    ];

    // Create CSV rows
    const rows = cases.map((c) => [
      c.id,
      c.applianceType,
      c.brand,
      c.model,
      c.rootCause,
      c.partCost,
      c.laborTimeMinutes,
      c.diyFeasibility,
      c.successful ? "Yes" : "No",
      c.date,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", `selffix_cases_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Service Agent Dashboard
          </h1>
          <p className="text-slate-600">
            Track and manage all repair cases in one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            label="Total Cases Logged"
            value={totalCases}
            icon={<FileText className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Most Common Issue"
            value={getMostCommonIssue()}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label="Avg Repair Cost"
            value={`$${getAverageCost()}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            label="Avg Resolution Time"
            value={`${getAverageLaborTime()} mins`}
            icon={<Clock className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/log-case")}
            className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            + Log New Repair Case
          </button>
          <button
            onClick={() => navigate("/admin/history")}
            className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md border border-slate-200 flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            View Case History
          </button>
          <button
            onClick={handleExportData}
            className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md border border-slate-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Cases</h2>
          {cases.length > 0 ? (
            <div className="space-y-4">
              {cases.slice(-5).reverse().map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {c.brand} {c.model}
                    </p>
                    <p className="text-sm text-slate-600">{c.rootCause}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${c.partCost}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">No cases logged yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
