'use client';

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    className?: string;
    children: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    isCursorPointer?: boolean;
    onClick?: () => void;
};

export default function Button(props: ButtonProps) {
    return (
        <button
            type={props.type ?? "button"}
            className={`${props.className} ${props.isCursorPointer ? 'cursor-pointer' : ''}`}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.tooltip}
        >
            {props.children}
        </button>
    );
}