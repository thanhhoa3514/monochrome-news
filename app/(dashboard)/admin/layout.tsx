import { redirect } from "next/navigation";
import { serverAuthService } from "@/lib/server";

import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await serverAuthService.me();

    if (!user) {
        redirect("/login");
    }

    const isAdmin = user.roles?.some(
        (role) => role.name.toLowerCase() === "admin"
    );

    if (!isAdmin) {
        redirect("/404");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
