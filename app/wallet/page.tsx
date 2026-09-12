"use client";
import { useEffect } from "react";
import { useUser } from "../hooks/UserContext";

export default function Wallet() {
    const { setUser } = useUser();

    useEffect(() => {
        setUser(null);
    }, [setUser]);

    return (
        <div>Wallet</div>
    )
}