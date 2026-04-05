import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";
import { ReactNode } from "react";

type Props = {
    onClick?: () => void;
    className?: string;
    children: ReactNode;
};

export default function Card({ children, onClick, className }: Props) {
    const theme = useTheme();

    return (
        <div
            className={cnClassNames("shadow-md rounded-2xl p-5 border", theme.theme.bg, theme.theme.border, className)}
            onClick={onClick}
        >
            {children}
        </div>
    );
}