import { redirect } from "next/navigation";

export default function WalletPage() {
    redirect("/wallet/overview");

    return null;
}