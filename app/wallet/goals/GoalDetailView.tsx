import { ArrowLeft, Edit3, Trash2, Calendar, Link as LinkIcon } from "lucide-react";
import Button from "@/app/components/Buttons/Button";
import { Goal } from "@/app/types";

type Props = {
    goal: Goal;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export default function GoalDetailView({ goal, onBack, onEdit, onDelete }: Props) {
    const progress = (goal.currentValue / goal.costToday) * 100;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header / Actions */}
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-all">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex gap-3">
                    <Button onClick={onEdit} className="p-2 px-4 border border-white/10 rounded-lg hover:bg-white/5 flex gap-2 items-center">
                        <Edit3 size={16} /> Edit
                    </Button>
                    <Button onClick={onDelete} className="p-2 px-4 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/10 flex gap-2 items-center">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-card-bg border border-white/10 rounded-3xl p-10 space-y-8">
                <div className="space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary">
                        {"goal.category"}
                    </div>
                    <h1 className="text-4xl font-bold">{goal.name}</h1>
                </div>

                {/* Massive Progress Circle or Bar */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-5xl font-bold">${goal.currentValue.toLocaleString()}</span>
                        <span className="text-xl opacity-50">Target: ${goal.costToday.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center text-lg font-medium text-primary">{progress.toFixed(1)}% Completed</p>
                </div>

                <hr className="border-white/5" />

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                        <Calendar className="text-primary mt-1" />
                        <div>
                            <p className="text-sm opacity-50">Timeline</p>
                            <p className="font-semibold">{new Date(goal.startYear).toLocaleDateString()} — {new Date(goal.endYear).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <LinkIcon className="text-primary mt-1" />
                        <div>
                            <p className="text-sm opacity-50">Linked Assets</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {/* {goal.linkedAssetIds.map((id: string) => (
                                    <span key={id} className="px-3 py-1 bg-white/5 rounded-lg text-xs border border-white/5">
                                        Asset ID: {id}
                                    </span>
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}