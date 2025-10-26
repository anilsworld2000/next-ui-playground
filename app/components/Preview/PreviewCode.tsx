import { useState } from "react";

type props = {
    title: string;
    value: string;
}
export default function PreviewCode({ title, value }: props) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <div className="mt-4">
            <div className="mb-1 flex flex-row justify-between" >
                <p className="font-semibold">{title}</p>
                <button
                    onClick={handleCopy}
                    className="text-xs bg-blue-500 rounded p-1 items-center hover:bg-blue-700"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            <pre className="text-xs bg-slate-800 p-3 rounded overflow-x-auto">
                {value}
            </pre>
        </div>
    )
}