export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-canvas text-main transition-colors duration-300">{children}</div>;
}