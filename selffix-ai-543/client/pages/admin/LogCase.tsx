import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CaseForm } from "@/components/admin/CaseForm";
import { Case } from "@/components/admin/CaseTable";

export default function LogCase() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitCase = async (formData: Omit<Case, "id" | "date">) => {
    try {
      setIsSubmitting(true);
      // Transform data to match backend schema
      const apiData = {
        ...formData,
        partCost: String(formData.partCost), // Convert number to string for numeric type
        date: new Date().toISOString().split('T')[0], // Add current date in YYYY-MM-DD format
      };

      // Submit to API
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error:', errorData);
        throw new Error('Failed to create case');
      }

      const newCase = await response.json();

      // Show success message
      setSuccessMessage(`Case #${newCase.id} logged successfully!`);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Error creating case:', error);
      setSuccessMessage('Failed to create case. Please try again.');
      setIsSubmitting(false); // Reset only on error, since redirect happens on success
    }
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
        <CaseForm onSubmit={handleSubmitCase} isLoading={isSubmitting} />
      </div>
    </AdminLayout>
  );
}
