import Link from "next/link";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";
import { ReactNode } from "react";

type Props = {
    onClick?: () => void;
    href?: string;
    ariaLabel?: string;
    className?: string;
    children: ReactNode;
};

export default function Card({ children, onClick, href, ariaLabel, className }: Props) {
    const theme = useTheme();
    const cardClassName = cnClassNames("shadow-md rounded-2xl p-5 border", theme.theme.bg, theme.theme.border, className);

    if (href) {
        return (
            <Link href={href} aria-label={ariaLabel} className={cardClassName}>
                {children}
            </Link>
        );
    }

    return (
        <div
            className={cardClassName}
            onClick={onClick}
        >
            {children}
        </div>
    );
}