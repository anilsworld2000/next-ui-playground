import '@/app/globals.css'
import { ReactNode } from 'react'
import { SelectedComponentProvider } from '../hooks/SelectedComponentContext'

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
    return (
        <SelectedComponentProvider>
            {children}
        </SelectedComponentProvider>
    )
}
