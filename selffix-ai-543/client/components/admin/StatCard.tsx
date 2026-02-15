import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "green" | "blue" | "yellow" | "purple";
}

const colorMap = {
  green: "bg-green-50 border-green-200",
  blue: "bg-blue-50 border-blue-200",
  yellow: "bg-yellow-50 border-yellow-200",
  purple: "bg-purple-50 border-purple-200",
};

const iconColorMap = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  purple: "bg-purple-100 text-purple-700",
};

export function StatCard({
  label,
  value,
  icon,
  color = "blue",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border ${colorMap[color]} shadow-sm p-6 flex items-start gap-4`}
    >
      {icon && (
        <div className={`w-12 h-12 rounded-lg ${iconColorMap[color]} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm text-slate-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
