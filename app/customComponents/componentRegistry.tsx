import { PlaygroundComponent } from "../types";
import { cursorList, cursorStyles, roundedList, roundedStyles, sizeList, sizeStyles, variantList, variantStyles } from "../variants";

const newLine: string = '\n';
const tab: string = '\t';
export const componentRegistry: PlaygroundComponent[] = [
    {
        id: 'button',
        name: "Button",
        classes: (props) => {
            return (`${componentRegistry.find(comp => comp.id === 'button')?.classes(props)}`)},
        render: (props) => {
            return (<button
                className={`
                    ${sizeStyles[props['size'] as string]}
                    ${variantStyles[props['variant'] as string]}
                    ${roundedStyles[props['rounded'] as string]}
                    ${props.disabled ? 'opacity-50 cursor-not-allowed' : cursorStyles[props['cursor'] as string]}
                `}
                disabled={props['disabled'] as boolean}>
                {props['label']}
            </button>)
        },
        code: {
            jsx: (props) => {
                const sizeClass = sizeStyles[props['size'] as string];
                return `<button className="${sizeClass} bg-blue-500 text-white rounded" ${props.disabled ? 'disabled' : ''}>${props.label}</button>`;
            },
            html: (props) => {
                const sizeClass = sizeStyles[props['size'] as string];
                return (`<button${newLine + tab}class="${sizeClass} bg-blue-500 text-white rounded"${props.disabled ? 'disabled' : ''}>${newLine + tab}${props.label}${newLine}</button>`
                );
            },
        },
        category: 'Action',
        tags: ["button", 'link'],
        defaultProps: [
            { name: 'label', type: 'string', label: 'Text', defaultValue: 'Click Me' },
            { name: 'size', type: 'select', label: 'Size', options: sizeList, defaultValue: sizeList[2] },
            { name: 'variant', type: 'select', label: 'Variant', options: variantList, defaultValue: variantList[0] },
            { name: 'rounded', type: 'select', label: 'Rounded', options: roundedList, defaultValue: roundedList[0] },
            { name: 'cursor', type: 'select', label: 'Cursor', options: cursorList, defaultValue: cursorList[0] },
            { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
        ]
    },
    // {
    //     name: "Link",
    //     render: () => <a href="#" className="text-blue-600 underline">Visit</a>,
    //     category: "Action",
    //     tags: ['link', 'download', 'button']
    // },
    // {
    //     name: "Input",
    //     render: () => <input type="text" placeholder="Type here..." className="border p-2" />,
    //     category: "Input",
    //     tags: ['input']
    // }
];
