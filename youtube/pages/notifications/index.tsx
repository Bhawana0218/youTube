import Link from "next/link";
import { useUser } from "@/lib/AuthContext";

const NotificationsPage = () => {
    const { user, loading } = useUser() as {
        user: any | null;
        loading: boolean;
    };

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-2">
                        See recent updates from channels you follow.
                    </p>
                </div>

                <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading notifications...</div>
                    ) : !user ? (
                        <div className="text-center py-20">
                            <p className="text-lg font-semibold text-gray-900">Sign in to view your notifications.</p>
                            <p className="mt-2 text-gray-600">Notifications will appear here when you sign in.</p>
                            <div className="mt-6 inline-flex rounded-full bg-black text-white px-5 py-3">
                                <Link href="/">Go back home</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 p-6">
                                <p className="text-sm text-gray-500">No new notifications yet.</p>
                                <p className="mt-2 text-gray-700">When creators publish new videos, likes your comments, or post updates, you’ll see them here.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
                                    <p className="mt-3 text-sm text-gray-600">Your notifications will appear once your subscriptions post new videos.</p>
                                </div>
                                <div className="rounded-3xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Stay updated</h2>
                                    <p className="mt-3 text-sm text-gray-600">Manage notification preferences in your channel settings.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
