import { useTheme } from "@/app/hooks/ThemeContext";
import { ListItem } from "@/app/types";
import cnClassNames from "@/app/utils";
import { Check } from "lucide-react";

interface ActionListProps<T> {
    items: ListItem<T>[];
    selectedValue?: T;
    onSelect: (value: T) => void;
    renderCustomItem?: (item: ListItem<T>) => React.ReactNode; // For complex needs
}

export default function ActionList<T>({ items, selectedValue, onSelect }: ActionListProps<T>) {
    const { theme } = useTheme();

    return (
        <ul role="menu" className="flex flex-col gap-1 list-none p-0 m-0">
            {items.map((item) => {
                const isSelected = selectedValue === item.value;

                return (
                    <li key={item.id} role="none">
                        <button
                            role="menuitem"
                            onClick={() => onSelect(item.value)}
                            className={cnClassNames(
                                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer",
                                isSelected ? `${theme.accent} ${theme.primaryText}` : theme.textMain, theme.hoverBg
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {item.indicator}
                                {item.icon}
                                <span>{item.label}</span>
                            </div>

                            {isSelected && <Check size={14} className="animate-in zoom-in" />}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}