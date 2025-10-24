import { useState } from "react";
import { PlaygroundComponent, PropValue } from "../types";
import cnClassNames from "../utils";

type props = {
    className?: string
    selectedComponent?: PlaygroundComponent;
    values: Record<string, PropValue>;
};

export default function PreviewSection({ className, selectedComponent, values }: props) {
    const [copied, setCopied] = useState(false);

    const RenderedComponent = selectedComponent?.render(values);
    const jsxString = selectedComponent?.code?.jsx(values) ?? '';
    const htmlString = selectedComponent?.code?.html(values) ?? '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsxString);
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

            {htmlString && (
                <div className="w-full max-w-2xl bg-gray-100 p-4 rounded-lg mt-8 relative">
                    <div className="h-7">
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded mb-2"
                        >
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>

                    <pre className="bg-gray-200 p-3 pt-5 rounded-md text-xs overflow-x-auto">{htmlString}</pre>
                </div>
            )}

            {/* Display Current Props for Debug */}
            {Object.keys(values).length > 0 && (
                <div className="w-full max-w-2xl bg-gray-100 p-4 rounded-lg mt-8">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Current Props (JSON)</h3>
                    <pre className="text-xs text-gray-600 bg-gray-200 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(values, null, 2)}
                    </pre>
                </div>
            )}
        </section >
    )
}