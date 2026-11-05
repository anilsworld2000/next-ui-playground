import { signIn } from "./actions";

export default function LoginPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border border-border-subtle bg-surface p-6 text-main shadow-sm">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Access</p>
                <h1 className="mt-2 text-2xl font-bold text-main">Sign in</h1>
            </div>

            <form action={signIn} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-main">
                    Full name
                    <input
                        name="name"
                        defaultValue="Demo User"
                        className="rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-main outline-none transition focus:border-border-strong focus:ring-2 focus:ring-focus/30"
                    />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-main">
                    Role
                    <select
                        name="role"
                        defaultValue="user"
                        className="rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-main outline-none focus:border-border-strong focus:ring-2 focus:ring-focus/30"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
