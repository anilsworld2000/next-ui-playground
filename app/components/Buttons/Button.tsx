'use client';

type ButtonProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
};

export default function Button(props: ButtonProps) {
    return (
        <button className={`${props.className}`} onClick={props.onClick}>{props.children}</button>
    );
}