"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from "@/app/utils";
import Tabs from "@/app/components/Layouts/Tabs";
import Button from "@/app/components/Buttons/Button";
import Dropdown from "@/app/components/Dropdown/Dropdown";
import {Save, X } from "lucide-react";
import FormInput from "@/app/components/Form/FormInput";

// Form state interface
export interface GoalCreateFormData {
    // Basics
    name: string;
    riskProfile: "Low" | "Moderate" | "High";

    // Timeline
    startYear: number;
    targetYear: number;
    postGoalYears: number;

    // Financial
    targetAmount: number;
    inflationRate: number;

    // Investment
    initialInvestment: number;
    monthlyContribution: number;
    expectedReturnRate: number;
}

const INITIAL_FORM_STATE: GoalCreateFormData = {
    name: "",
    riskProfile: "Moderate",
    startYear: new Date().getFullYear(),
    targetYear: new Date().getFullYear() + 1,
    postGoalYears: 0,
    targetAmount: 0,
    inflationRate: 6,
    initialInvestment: 0,
    monthlyContribution: 0,
    expectedReturnRate: 8,
};

interface GoalCreateFormProps {
    onSubmit: (data: GoalCreateFormData) => void;
    onClose: () => void;
}

type TabId = "basics" | "timeline" | "financial" | "investment";

export default function GoalCreateForm({ onSubmit, onClose }: GoalCreateFormProps) {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<GoalCreateFormData>(INITIAL_FORM_STATE);
    const [activeTab, setActiveTab] = useState<TabId>("basics");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // const validateAll = (): boolean => {
    //     const tabs: TabId[] = ["basics", "timeline", "financial", "investment"];
    //     return tabs.every(validateTab);
    // };

    // Validation logic
    const validateTab = (tabId: TabId): boolean => {
        const newErrors: Record<string, string> = {};

        if (tabId === "basics") {
            if (!formData.name.trim()) newErrors.name = "Goal name is required";
            else if (formData.name.length < 1 || formData.name.length > 150)
                newErrors.name = "Name must be 1-150 characters";
        }

        if (tabId === "timeline") {
            if (formData.startYear < 1900 || formData.startYear > 2500)
                newErrors.startYear = "Start year must be between 1900-2500";
            if (formData.targetYear < 1900 || formData.targetYear > 2500)
                newErrors.targetYear = "Target year must be between 1900-2500";
            if (formData.targetYear <= formData.startYear)
                newErrors.targetYear = "Target year must be after start year";
            if (formData.postGoalYears < 0 || formData.postGoalYears > 100)
                newErrors.postGoalYears = "Post-goal years must be 0-100";
        }

        if (tabId === "financial") {
            if (formData.targetAmount <= 0) newErrors.targetAmount = "Target amount must be greater than 0";
            if (formData.inflationRate < 0 || formData.inflationRate > 50)
                newErrors.inflationRate = "Inflation rate must be 0-50%";
        }

        if (tabId === "investment") {
            if (formData.initialInvestment < 0) newErrors.initialInvestment = "Cannot be negative";
            if (formData.monthlyContribution < 0) newErrors.monthlyContribution = "Cannot be negative";
            if (formData.expectedReturnRate < 0) newErrors.expectedReturnRate = "Cannot be negative";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof GoalCreateFormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCreate = async () => {
        if (!validateTab(activeTab)) return;

        setIsLoading(true);
        try {
            onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    };

    // Tab content renderers
    const renderBasicsTab = () => (
        <div className="space-y-4">
            <FormInput
                label="Goal Name"
                value={formData.name}
                onChange={(v) => handleInputChange("name", v)}
                placeholder="e.g., Vacation Fund, Retirement"
                error={errors.name}
            />
            <div className="flex flex-col gap-2">
                <label className={cnClassNames("text-sm font-semibold", theme.textMain)}>
                    Risk Profile
                </label>
                <Dropdown<"Low" | "Moderate" | "High">
                    options={[
                        { id: "low", label: "Low Risk", value: "Low" },
                        { id: "moderate", label: "Moderate Risk", value: "Moderate" },
                        { id: "high", label: "High Risk", value: "High" },
                    ]}
                    value={formData.riskProfile}
                    onChange={(value) => handleInputChange("riskProfile", value)}
                />
            </div>
        </div>
    );

    const renderTimelineTab = () => (
        <div className="space-y-4">
            <FormInput
                label="Start Year"
                value={formData.startYear}
                onChange={(v) => handleInputChange("startYear", v)}
                type="number"
                min={1900}
                max={2500}
                error={errors.startYear}
            />
            <FormInput
                label="Target Year"
                value={formData.targetYear}
                onChange={(v) => handleInputChange("targetYear", v)}
                type="number"
                min={1900}
                max={2500}
                error={errors.targetYear}
            />
            <FormInput
                label="Post-Goal Years"
                value={formData.postGoalYears}
                onChange={(v) => handleInputChange("postGoalYears", v)}
                type="number"
                min={0}
                max={100}
                error={errors.postGoalYears}
            />
        </div>
    );

    const renderFinancialTab = () => (
        <div className="space-y-4">
            <FormInput
                label="Target Amount"
                value={formData.targetAmount}
                onChange={(v) => handleInputChange("targetAmount", v)}
                type="number"
                placeholder="0"
                suffix="₹"
                error={errors.targetAmount}
            />
            <FormInput
                label="Inflation Rate"
                value={formData.inflationRate}
                onChange={(v) => handleInputChange("inflationRate", v)}
                type="number"
                min={0}
                max={50}
                suffix="%"
                error={errors.inflationRate}
            />
        </div>
    );

    const renderInvestmentTab = () => (
        <div className="space-y-4">
            <FormInput
                label="Initial Investment"
                value={formData.initialInvestment}
                onChange={(v) => handleInputChange("initialInvestment", v)}
                type="number"
                placeholder="0"
                suffix="₹"
                error={errors.initialInvestment}
            />
            <FormInput
                label="Monthly Contribution"
                value={formData.monthlyContribution}
                onChange={(v) => handleInputChange("monthlyContribution", v)}
                type="number"
                placeholder="0"
                suffix="₹"
                error={errors.monthlyContribution}
            />
            <FormInput
                label="Expected Return Rate"
                value={formData.expectedReturnRate}
                onChange={(v) => handleInputChange("expectedReturnRate", v)}
                type="number"
                min={0}
                suffix="%"
                error={errors.expectedReturnRate}
            />
        </div>
    );

    const tabs = useMemo(
        () => [
            {
                id: "basics" as TabId,
                label: "Basics",
                content: renderBasicsTab(),
            },
            {
                id: "timeline" as TabId,
                label: "Timeline",
                content: renderTimelineTab(),
            },
            {
                id: "financial" as TabId,
                label: "Financial",
                content: renderFinancialTab(),
            },
            {
                id: "investment" as TabId,
                label: "Investment",
                content: renderInvestmentTab(),
            },
        ],
        [formData, errors, renderBasicsTab, renderTimelineTab, renderFinancialTab, renderInvestmentTab]
    );

    return (
        <div className={cnClassNames("flex flex-col h-full p-2", theme.bg)}>
            {/* Header */}
            <div className={cnClassNames("flex justify-between items-center pb-2")}>
                <h2 className={cnClassNames("text-md font-bold flex-col-1", theme.textMain)}>Create New Goal</h2>
                <div className="flex-cols-2 gap-2 flex">
                    <Button
                        onClick={handleCreate}
                        isCursorPointer
                        disabled={isLoading || activeTab !== "investment"}
                        className={cnClassNames("flex items-center gap-2 px-2 py-1 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm", theme.textMain, theme.accent, (isLoading || activeTab !== "investment") ? theme.textMuted : theme.hoverBg)}
                    >
                        <Save size={ICON_SIZES.sm} />
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                    <Button
                        onClick={onClose}
                        tooltip={GENERIC_LABELS.close}
                        aria-label="Close goal creation form"
                        className={cnClassNames("p-1 rounded transition-colors", theme.hoverBg, theme.textMain)}
                    >
                        <X size={ICON_SIZES.md} />
                    </Button>
                </div>
            </div>

            {/* Tab Navigation - Using Tabs Component */}
            <Tabs
                tabs={tabs}
                rememberActiveTab={false} // We don't want to persist this across sessions
                storageKey="wallet.goal-create.activeTab"
                className="flex-1 overflow-auto"
                onBeforeTabChange={(newTabId, currentTabId) => {
                    // Validate current tab before allowing switch
                    if (validateTab(currentTabId as TabId)) {
                        setActiveTab(newTabId as TabId);
                        return true;
                    }
                    return false;
                }}
            />
        </div>
    );
}
