'use client';

type ButtonProps = {
    className?: string;
    children: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    onClick?: () => void;
};

export default function Button(props: ButtonProps) {
    return (
        <button
            className={`${props.className}`}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.tooltip}
        >
            {props.children}
        </button>
    );
}