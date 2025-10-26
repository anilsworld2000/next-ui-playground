type props = {
    component: React.ReactNode;
};

export default function PreviewComponent({ component }: props) {
    return (
        <div className="p-4 border-4 rounded-xl border-dashed border-gray-200 bg-gray-50 min-h-auto h-full w-full max-w-2xl flex items-center justify-center shadow-inner">
            {component ? component : (<p className="text-gray-500">No component selected</p>)}
        </div>
    )
}