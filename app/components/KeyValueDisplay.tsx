import { useTheme } from "../hooks/ThemeContext";

type Props = {
    label: string;
    value: string | number;
    inLine: boolean;
};

export default function KeyValueDisplay({ label, value, inLine }: Props) {
    const theme = useTheme();
    const cssClass = "font-medium";

    if (inLine) {
        return (
            <div>
                <p className={theme.theme.textMuted}>{label}: </p>
                <p className={cssClass}>{value}</p>
            </div>
        );
    }

    return (
        <div>
            <span className={theme.theme.textMuted}>{label}: </span>
            <span className={cssClass}>{value}</span>
        </div>
    );
}
  