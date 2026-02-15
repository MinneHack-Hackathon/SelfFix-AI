import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CaseForm } from "@/components/admin/CaseForm";
import { Case } from "@/components/admin/CaseTable";

export default function LogCase() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitCase = (formData: Omit<Case, "id" | "date">) => {
    // Generate unique ID
    const allCases = JSON.parse(localStorage.getItem("adminCases") || "[]") as Case[];
    const newId = Math.max(...allCases.map((c) => c.id), 0) + 1;

    // Create new case with ID and date
    const newCase: Case = {
      ...formData,
      id: newId,
      date: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    allCases.push(newCase);
    localStorage.setItem("adminCases", JSON.stringify(allCases));

    // Show success message
    setSuccessMessage(`Case #${newId} logged successfully!`);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Log Repair Case
          </h1>
          <p className="text-slate-600">
            Record details of a completed repair for documentation and analysis.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-semibold">{successMessage}</p>
            <p className="text-sm text-green-600">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Form */}
        <CaseForm onSubmit={handleSubmitCase} />
      </div>
    </AdminLayout>
  );
}
