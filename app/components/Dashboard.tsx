import { useEffect, useState } from "react";
import { componentRegistry } from "../customComponents/componentRegistry";
import { useSelectedComponent } from "../hooks/SelectedComponentContext";
import ComponentsSection from "./ComponentsSection";
import PreviewSection from "./Preview/PreviewSection";
import PropertiesSection from "./Properties/PropertiesSection";
import { PlaygroundComponent, PropValue } from "../types";

export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textMuted: string;
        border: string;
        success: string;
        warning: string;
        error: string;
    };
    borderRadius: string;
    spacing: string;
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
}

export const defaultTheme: Theme = {
    id: 'default',
    name: 'Default',
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#10b981',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textMuted: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
    },
    borderRadius: '0.5rem',
    spacing: '1rem',
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
};


export function extractDefaultProps(component: PlaygroundComponent): Record<string, PropValue> {
    return Object.fromEntries(
        component.defaultProps.map((prop) => [prop.name, prop.defaultValue ?? getFallbackValue(prop.type)])
    );
}

function getFallbackValue(type: string): PropValue {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'select':
            return ''; // or first option if available
        default:
            return undefined;
    }
}

export default function Dashboard() {
    const [componentProps, setComponentProps] = useState<Record<string, PropValue>>({});
    const { selectedComponent } = useSelectedComponent();
    
    const Component = componentRegistry.find(c => c.name === selectedComponent);

    useEffect(() => {
        if (Component) {
            const initialProps: Record<string, PropValue> = extractDefaultProps(Component);
            setComponentProps(initialProps);
        }
        else {
            setComponentProps({});
        }
    }, [Component, selectedComponent]);
      
    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Components Panel */}
            <div className="md:w-1/5 w-full p-4 border-b md:border-b-0 md:border-r border-gray-300 shadow-sm overflow-auto">
                <ComponentsSection />
            </div>

            {/* Preview Panel */}
            <div className="flex-1 p-4 overflow-auto">
                <PreviewSection
                    selectedComponent={Component}
                    values={componentProps}
                    />
            </div>

            {/* Properties Panel */}
            <div className="md:w-1/4 w-full p-4 border-t md:border-t-0 md:border-l border-gray-300 overflow-auto">
                <PropertiesSection
                    selectedComponent={Component}
                    values={componentProps}
                    onChange={setComponentProps}/>
            </div>
        </div>
    );
}