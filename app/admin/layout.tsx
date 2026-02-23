import { redirect } from "next/navigation";
import { serverAuthService } from "@/lib/server";

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

    return <>{children}</>;
}
