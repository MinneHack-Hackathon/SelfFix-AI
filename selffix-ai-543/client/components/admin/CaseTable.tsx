import { useState } from "react";
import { Eye, Edit2, Trash2, ChevronDown } from "lucide-react";

export interface Case {
  id: number;
  applianceType: string;
  brand: string;
  model: string;
  symptoms: string[];
  additionalNotes: string;
  diagnosticSteps: string[];
  rootCause: string;
  partReplaced: string;
  partCost: number;
  laborTimeMinutes: number;
  diyFeasibility: "Easy" | "Moderate" | "Professional Required";
  successful: boolean;
  date: string;
}

interface CaseTableProps {
  cases: Case[];
  onEdit: (caseData: Case) => void;
  onDelete: (id: number) => void;
  onView: (caseData: Case) => void;
}

export function CaseTable({
  cases,
  onEdit,
  onDelete,
  onView,
}: CaseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");

  // Filter and sort cases
  const filteredCases = cases
    .filter(
      (c) =>
        c.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rootCause.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.partCost - a.partCost;
      }
    });

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <p className="text-slate-500">No cases logged yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search and Sort */}
      <div className="p-6 border-b border-slate-200 flex gap-4">
        <input
          type="text"
          placeholder="Search by model or root cause..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "cost")}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="date">Sort by Date</option>
          <option value="cost">Sort by Cost</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Model
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Root Cause
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseData) => (
              <tr
                key={caseData.id}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  #{caseData.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  {caseData.model}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {caseData.rootCause}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  ${caseData.partCost}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(caseData.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      caseData.successful
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {caseData.successful ? "Success" : "Failed"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(caseData)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(caseData)}
                      className="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(caseData.id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-500">No cases match your search.</p>
        </div>
      )}
    </div>
  );
}
