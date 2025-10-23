import { useState } from "react";
import { PlaygroundComponent } from "../types";
import cnClassNames from "../utils";
import { renderToHTML } from "next/dist/server/render";

type props = {
    className?: string
    selectedComponent?: PlaygroundComponent;
    values: Record<string, any>;
};

export default function PreviewSection({ className, selectedComponent, values }: props) {
    const [copied, setCopied] = useState(false);

    const RenderedComponent = selectedComponent?.render(values);
    const codeString = selectedComponent?.code?.(values) ?? '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };
    
    return (
        < section className={cnClassNames('', className)} >
            <div className="font-semibold mb-4">
                {selectedComponent ? (
                    <p>Preview: {selectedComponent.name}</p>
                ) : (
                    <p>Preview: No component selected</p>
                )}
            </div>
            <div className="p-4 border-4 rounded-xl border-dashed border-gray-200 bg-gray-50 min-h-auto h-full w-full max-w-2xl flex items-center justify-center shadow-inner">
                {RenderedComponent}
            </div>

            {codeString && (
                <div className="relative">
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{codeString}</pre>
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
            )}
        </section >
    )
}