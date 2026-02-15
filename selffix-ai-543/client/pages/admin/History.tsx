import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CaseTable, Case } from "@/components/admin/CaseTable";
import { X } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Load cases from localStorage
  useEffect(() => {
    const storedCases = localStorage.getItem("adminCases");
    if (storedCases) {
      setCases(JSON.parse(storedCases));
    }
  }, []);

  const handleEdit = (caseData: Case) => {
    // In a real app, you'd navigate to an edit page or open an edit modal
    // For now, we'll show an alert
    alert(`Edit functionality for case #${caseData.id} - Coming soon`);
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      const updatedCases = cases.filter((c) => c.id !== id);
      setCases(updatedCases);
      localStorage.setItem("adminCases", JSON.stringify(updatedCases));
    }
  };

  const handleView = (caseData: Case) => {
    setSelectedCase(caseData);
    setShowViewModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Case History
          </h1>
          <p className="text-slate-600">
            View, search, and manage all logged repair cases.
          </p>
        </div>

        {/* Table */}
        <CaseTable
          cases={cases}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* View Modal */}
      {showViewModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">
                Case #{selectedCase.id}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Appliance Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Appliance Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Type</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.applianceType}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Brand</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.brand}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Model</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.model}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(selectedCase.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Reported Symptoms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedCase.additionalNotes && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Additional Notes
                  </h3>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                    {selectedCase.additionalNotes}
                  </p>
                </div>
              )}

              {/* Diagnostic Steps */}
              {selectedCase.diagnosticSteps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Diagnostic Steps
                  </h3>
                  <ol className="space-y-2">
                    {selectedCase.diagnosticSteps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="font-semibold text-slate-600">
                          {index + 1}.
                        </span>
                        <span className="text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Root Cause & Repair Details */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Repair Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Root Cause</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.rootCause}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Part Replaced</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.partReplaced}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Part Cost</p>
                    <p className="font-semibold text-slate-900">
                      ${selectedCase.partCost}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Labor Time</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.laborTimeMinutes} mins
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">DIY Feasibility</p>
                    <p className="font-semibold text-slate-900">
                      {selectedCase.diyFeasibility}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Status</p>
                    <p
                      className={`font-semibold ${
                        selectedCase.successful
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedCase.successful ? "Successful" : "Failed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3 bg-slate-50">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Edit functionality coming soon for case #${selectedCase.id}`);
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                Edit Case
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
