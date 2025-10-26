import { PlaygroundComponent, PropValue } from "../../types";
import cnClassNames from "../../utils";
import PreviewCode from "./PreviewCode";
import PreviewComponent from "./PreviewComponent";

type props = {
    className?: string
    selectedComponent?: PlaygroundComponent;
    values: Record<string, PropValue>;
};

export default function PreviewSection({ className, selectedComponent, values }: props) {
    const RenderedComponent = selectedComponent?.render(values);
    const jsxString = selectedComponent?.code?.jsx(values) ?? '';
    const htmlString = selectedComponent?.code?.html(values) ?? '';

    return (
        < section className={cnClassNames('', className)} >
            <div className="font-semibold mb-4">
                <p>{`Preview: ${selectedComponent ? selectedComponent.name : ''}`}</p>
            </div>

            {/* Preview Component */}
            <PreviewComponent component={RenderedComponent} />

            <div className="text-white w-full max-w-2xl bg-slate-900 p-4 rounded-lg mt-8">
                {/* JSX Code */}
                {
                    jsxString && (
                        <PreviewCode
                            title='JSX'
                            value={jsxString}
                        ></PreviewCode>
                    )}

                {/* HTML Code */}
                {
                    htmlString && (
                        <PreviewCode
                            title='HTML'
                            value={htmlString}
                        ></PreviewCode>
                    )}

                {/* Display Current Props for Debug */}
                {Object.keys(values).length > 0 && (
                    <PreviewCode
                        title='Current Props (JSON)'
                        value={JSON.stringify(values, null, 2)}
                    ></PreviewCode>
                )}
            </div>
        </section >
    )
}