import '@/app/globals.css'
import { ReactNode } from 'react'

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
    return (
            <div>{children}</div>
    )
}
