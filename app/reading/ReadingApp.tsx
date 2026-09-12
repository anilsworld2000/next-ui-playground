"use client";

import {
    ChangeEvent,
    useCallback,
    useRef,
    useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    BookOpen,
    Clipboard,
    Download,
    FileText,
    Printer,
    RotateCcw,
    Upload,
} from "lucide-react";
import Button from "../components/Buttons/Button";
import Notification from "../components/Notifications/Notification";
import { useTheme } from "../hooks/ThemeContext";
import cnClassNames, { ICON_SIZES } from "../utils";
import "./reading.css";

type ViewMode = "rendered" | "raw";

const MARKDOWN_EXTENSION = ".md";

function countWords(content: string) {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
}

function isMarkdownFile(file: File) {
    return file.name.toLowerCase().endsWith(MARKDOWN_EXTENSION);
}

export default function ReadingApp() {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");
    const [content, setContent] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>("rendered");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const hasDocument = Boolean(fileName);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        setError("");
        setStatus("");

        if (!file) return;

        if (!isMarkdownFile(file)) {
            setError("Choose a Markdown file with a .md extension.");
            return;
        }

        try {
            const nextContent = await file.text();
            setFileName(file.name);
            setContent(nextContent);
            setFileSize(file.size);
            setViewMode("rendered");
            setStatus("Document opened.");
        } catch {
            setError("This file could not be read. Please try another Markdown file.");
        }
    };

    const clearDocument = () => {
        setFileName("");
        setContent("");
        setFileSize(0);
        setViewMode("rendered");
        setStatus("");
        setError("");
    };

    const copyContent = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setError("");
            setStatus("Markdown copied to the clipboard.");
        } catch {
            setError("Clipboard access was blocked. Copy the text from raw view instead.");
        }
    };

    const downloadContent = () => {
        const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "document.md";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setStatus("Markdown download started.");
    };

    const dismissNotification = useCallback(() => {
        setError("");
        setStatus("");
    }, []);

    return (
        <div className="reading-app flex min-h-[calc(100vh-4rem)] flex-col gap-3 p-1">
            <header className="reading-toolbar flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <BookOpen size={ICON_SIZES.xlg} aria-hidden="true" />
                        <h1 className="truncate text-xl font-bold">Markdown Reader</h1>
                    </div>
                    <p className={cnClassNames("mt-1 text-xs", theme.theme.textMuted)}>
                        Open a local Markdown file and keep it in this browser session.
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    className="sr-only"
                    type="file"
                    accept=".md,text/markdown"
                    onChange={handleFileChange}
                    aria-label="Choose a Markdown file"
                />
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        className={cnClassNames("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm", theme.theme.button)}
                        isCursorPointer
                        onClick={openFilePicker}
                        tooltip="Open a Markdown file"
                    >
                        <Upload size={ICON_SIZES.lg} aria-hidden="true" />
                        Open file
                    </Button>
                    {hasDocument && (
                        <>
                            <div className="flex overflow-hidden rounded-lg border" role="group" aria-label="Document view">
                                <button
                                    type="button"
                                    className={cnClassNames("px-3 py-2 text-sm", viewMode === "rendered" ? theme.theme.accent : theme.theme.hoverBg)}
                                    onClick={() => setViewMode("rendered")}
                                    aria-pressed={viewMode === "rendered"}
                                >
                                    Read
                                </button>
                                <button
                                    type="button"
                                    className={cnClassNames("px-3 py-2 text-sm", viewMode === "raw" ? theme.theme.accent : theme.theme.hoverBg)}
                                    onClick={() => setViewMode("raw")}
                                    aria-pressed={viewMode === "raw"}
                                >
                                    Raw
                                </button>
                            </div>
                            <Button
                                className={cnClassNames("inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", theme.theme.hoverBg)}
                                isCursorPointer
                                onClick={copyContent}
                                tooltip="Copy Markdown source"
                            >
                                <Clipboard size={ICON_SIZES.lg} aria-hidden="true" />
                                Copy
                            </Button>
                            <Button
                                className={cnClassNames("inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", theme.theme.hoverBg)}
                                isCursorPointer
                                onClick={downloadContent}
                                tooltip="Download Markdown source"
                            >
                                <Download size={ICON_SIZES.lg} aria-hidden="true" />
                                Download
                            </Button>
                            <Button
                                className={cnClassNames("inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", theme.theme.hoverBg)}
                                isCursorPointer
                                onClick={() => window.print()}
                                tooltip="Print document"
                            >
                                <Printer size={ICON_SIZES.lg} aria-hidden="true" />
                                Print
                            </Button>
                            <Button
                                className={cnClassNames("inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm", theme.theme.hoverBg)}
                                isCursorPointer
                                onClick={clearDocument}
                                tooltip="Close document"
                            >
                                <RotateCcw size={ICON_SIZES.lg} aria-hidden="true" />
                                Clear
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {(error || status) && (
                <Notification
                    message={error || status}
                    tone={error ? "error" : "success"}
                    onDismiss={dismissNotification}
                />
            )}

            {!hasDocument ? (
                <section className={cnClassNames("reading-empty flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center", theme.theme.card, theme.theme.border)}>
                    <FileText size={40} strokeWidth={1.5} aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-semibold">Choose a Markdown file to begin</h2>
                    <p className={cnClassNames("mt-2 max-w-md text-sm", theme.theme.textMuted)}>
                        Your file stays in browser memory. Nothing is uploaded or saved by this reader.
                    </p>
                    <Button
                        className={cnClassNames("mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm", theme.theme.button)}
                        isCursorPointer
                        onClick={openFilePicker}
                    >
                        <Upload size={ICON_SIZES.lg} aria-hidden="true" />
                        Select .md file
                    </Button>
                </section>
            ) : (
                <section className={cnClassNames("reading-document-shell flex-1 overflow-hidden rounded-xl border", theme.theme.card, theme.theme.border)}>
                    <div className="reading-document-meta flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <FileText size={ICON_SIZES.lg} aria-hidden="true" />
                            <span className="truncate text-sm font-medium">{fileName}</span>
                        </div>
                        <span className={cnClassNames("text-xs", theme.theme.textMuted)}>
                            {content.length.toLocaleString()} characters · {countWords(content).toLocaleString()} words · {(fileSize / 1024).toFixed(1)} KB
                        </span>
                    </div>
                    <article className="markdown-document mx-auto max-w-4xl px-5 py-8 sm:px-10">
                        {viewMode === "rendered" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        ) : (
                            <pre className="reading-raw whitespace-pre-wrap break-words">{content}</pre>
                        )}
                    </article>
                </section>
            )}
        </div>
    );
}