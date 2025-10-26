import { PlaygroundComponent, PropValue } from "../../types";

type props = {
    className?: string
    selectedComponent?: PlaygroundComponent;
    values: Record<string, PropValue>;
    onChange: (updated: Record<string, PropValue>) => void;
};

export default function PropertiesSection({ className, selectedComponent, values, onChange }: props) {

    const handleChange = (name: string, value: PropValue) => {
        onChange({ ...values, [name]: value });
    };

    return (
        <section className={className}>
            <div className="mb-4">
                <p className="font-semibold">Properties: {selectedComponent?.name}</p>

                {!selectedComponent && <p className="text-sm text-gray-500">Select a component to edit its properties.</p>}

                {selectedComponent &&
                    selectedComponent.defaultProps.map(prop => (
                        <div key={prop.name} className="flex flex-col">
                            {prop.type != 'boolean' && <label className={`text-sm mt-1`}>{prop.label || prop.name}</label>}

                            {prop.type === 'string' && (
                                <input
                                    title={prop.label}
                                    type="text"
                                    value={values[prop.name] as string ?? ''}
                                    onChange={(e) => handleChange(prop.name, e.target.value)}
                                    className="text-sm border rounded px-2 py-1"
                                />
                            )}
                            {prop.type === 'number' && (
                                <input
                                    title={prop.label}
                                    type="number"
                                    value={values[prop.name] as number ?? prop.defaultValue}
                                    onChange={(e) => handleChange(prop.name, Number(e.target.value))}
                                    className="text-sm border rounded px-2 py-1"
                                />
                            )}
                            {prop.type === 'boolean' && (
                                <div className="flex items-center justify-between mb-3 mt-1">
                                    <label htmlFor={prop.name} className="text-sm font-medium">
                                        {prop.label}
                                    </label>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id={prop.name}
                                            type="checkbox"
                                            checked={values[prop.name] as boolean ?? prop.defaultValue}
                                            onChange={(e) => handleChange(prop.name, e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                                        <div className="absolute left-1 top-1 bg-white w-2 h-2 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </label>
                                </div>

                            )}
                            {prop.type === 'select' && (
                                <select
                                    title={prop.label}
                                    value={values[prop.name] as string ?? prop.defaultValue}
                                    onChange={(e) => handleChange(prop.name, e.target.value)}
                                    className="text-sm border rounded px-2 py-1"
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