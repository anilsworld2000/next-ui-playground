import { signIn } from "./actions";

export default function LoginPage() {
    return (
        <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Access</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in</h1>
            </div>

            <form action={signIn} className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full name
                    <input
                        name="name"
                        defaultValue="Demo User"
                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Role
                    <select
                        name="role"
                        defaultValue="user"
                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
