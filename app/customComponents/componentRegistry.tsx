import { PlaygroundComponent } from "../types";
//import Button from "./components/button";

type size = 'sm' | 'md' | 'lg';
const sizeVariants: Record<size, string> = {
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
}

export const componentRegistry: PlaygroundComponent[] = [
    {
        id: 'button',
        name: "Button",
        render: (props) => {
            return (<button
                className={`${sizeVariants[props['size'] as size]} px-4 py-2 bg-blue-500 text-white`}
                disabled={props['disabled']}>
                {props['label']}
            </button>)
        },
        code: (props) => { return '' },
        category: 'Action',
        tags: ["button", 'link'],
        defaultProps: [
            { name: 'label', type: 'string', label: 'Text', defaultValue: 'Click Me' },
            { name: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
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

function renderToString(node: React.ReactNode, props: Record<string, any>) {

}
