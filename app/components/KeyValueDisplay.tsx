type Props = {
    label: string;
    value: string | number;
    inLine: boolean;
};

export default function KeyValueDisplay({ label, value, inLine }: Props) {
    const cssClass = "font-medium";

    if (inLine) {
        return (
            <div>
                <p className="text-muted">{label}: </p>
                <p className={cssClass}>{value}</p>
            </div>
        );
    }

    return (
        <div>
            <span className="text-muted">{label}: </span>
            <span className={cssClass}>{value}</span>
        </div>
    );
}
  