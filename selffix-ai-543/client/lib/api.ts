
export interface DiagnosisData {
    appliance_type: string;
    // selected_symptoms: string[]; // Removed from UI, keeping out of interface to match usage
    custom_description: string;
    image: File | null;
}

export interface DiagnosisResult {
    response?: string;
    diagnosis?: {
        most_likely_issue: string;
        confidence_percent: number;
        severity: string;
    };
    cost_analysis?: {
        estimated_repair_cost: number;
        estimated_replacement_cost: number;
        estimated_savings: number;
    };
    environmental_impact?: {
        carbon_saved_kg: number;
    };
    repair_details?: {
        difficulty_level: string;
        tools_required: string[];
        steps: string[];
        safety_warning: string;
    };
}

export const api = {
    // Base Endpoint: Checks if the server is running correctly.
    checkStatus: async (): Promise<{ message: string }> => {
        try {
            // Assuming /api/status proxies to backend status endpoint or root if configured
            const res = await fetch("/api/status");
            if (!res.ok) throw new Error("Failed to check status");
            return res.json();
        } catch (error) {
            console.error("API Status Check Request Failed", error);
            throw error;
        }
    },

    // Run Prompt Endpoint: Process a user prompt.
    askAI: async (prompt: string): Promise<{ response: string }> => {
        // URL: /api/<user_prompt>
        const res = await fetch(`/api/${encodeURIComponent(prompt)}`);
        if (!res.ok) throw new Error("Failed to get AI response");
        return res.json();
    },

    // Diagnose Endpoint: Diagnoses appliance issues.
    diagnose: async (data: DiagnosisData): Promise<DiagnosisResult> => {
        const formData = new FormData();
        formData.append("appliance_type", data.appliance_type);
        formData.append("user_prompt", data.custom_description);
        if (data.image) {
            formData.append("image", data.image);
        }

        // URL: /api/diagnose
        const res = await fetch("/api/diagnose", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to submit diagnosis");
        return res.json();
    },
};
