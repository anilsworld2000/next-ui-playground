import { PlaygroundComponent } from "../types";
import { getStyleClassesFromProps, newLine, tab } from "../utils";
import { cursorList, roundedList, sizeList, variantList } from "../variants";

export const componentRegistry: PlaygroundComponent[] = [
    {
        id: 'button',
        name: "Button",
        render: (props) => {
            return (<button
                className={` ${getStyleClassesFromProps(props)} `}
                disabled={props['disabled'] as boolean}>
                {props['useJSX'] ? props['JSX'] : props['label']}
            </button>)
        },
        code: {
            jsx: (props) => {
                const content = props.children ? `{/* custom children */}` : props.label;
                return `<button${newLine + tab}className=${getStyleClassesFromProps(props)}${newLine}${props.disabled ? 'disabled' : ''}>${newLine + tab}${content}${newLine}</button>`;
            },
            html: (props) => {
                const content = props.children ? '<!-- custom children -->' : props.label;
                return `<button${newLine + tab}class=${getStyleClassesFromProps(props)}${newLine}${props.disabled ? 'disabled' : ''}>${newLine + tab}${content}${newLine}</button>`;
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
            { name: 'useJSX', type: 'boolean', label: 'Use Custom Elements', defaultValue: false },
            { name: 'JSX', type: 'jsx', label: 'Custom Element', defaultValue: '' },
        ]
    }
];
