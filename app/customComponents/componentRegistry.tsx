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
                {props['label']}
            </button>)
        },
        code: {
            jsx: (props) => {
                return `<button ${newLine + tab} className = ${getStyleClassesFromProps(props)} ${newLine}${props.disabled ? 'disabled' : ''}> ${newLine + tab + props.label + newLine}</button>`;
            },
            html: (props) => {
                return (`<button ${newLine + tab} class = ${getStyleClassesFromProps(props)}" ${newLine}${props.disabled ? 'disabled' : ''}>${newLine + tab + props.label + newLine}</button>`
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
