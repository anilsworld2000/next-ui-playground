import { PlaygroundComponent } from "../types";

type props = {
    className?: string
    selectedComponent?: PlaygroundComponent;
    values: Record<string, any>;
    onChange: (updated: Record<string, any>) => void;
};

export default function PropertiesSection({ className, selectedComponent, values, onChange }: props) {

    const handleChange = (name: string, value: any) => {
        onChange({ ...values, [name]: value });
    };
    
    return (
        <section className={className}>
            <div className="font-semibold mb-4">
                <p>Properties: {selectedComponent?.name}</p>

                {!selectedComponent && <p className="text-sm font-medium">Select a component to edit its properties.</p>}

                {selectedComponent && 
                    selectedComponent.defaultProps.map(prop => (
                    <div key={prop.name} className="flex flex-col">
                            <label className="text-sm font-medium mb-1">{prop.label || prop.name}</label>
                            {prop.type === 'string' && (
                                <input
                                    title={prop.label}
                                    type="text"
                                    value={values[prop.name] ?? ''}
                                    onChange={(e) => handleChange(prop.name, e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                            )}
                            {prop.type === 'number' && (
                                <input
                                    title={prop.label}
                                    type="number"
                                    value={values[prop.name] ?? 0}
                                    onChange={(e) => handleChange(prop.name, Number(e.target.value))}
                                    className="border rounded px-2 py-1"
                                />
                            )}
                            {prop.type === 'boolean' && (
                                <input
                                    title={prop.label}
                                    type="checkbox"
                                    checked={values[prop.name] ?? false}
                                    onChange={(e) => handleChange(prop.name, e.target.checked)}
                                />
                            )}
                            {prop.type === 'select' && (
                                <select
                                    title={prop.label}
                                    value={values[prop.name] ?? prop.options?.[0]}
                                    onChange={(e) => handleChange(prop.name, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    {prop.options?.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                ))}
            </div>
        </section>
    )
}