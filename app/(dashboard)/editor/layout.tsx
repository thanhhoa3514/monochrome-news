import { redirect } from "next/navigation";
import { serverAuthService } from "@/lib/server";

export const dynamic = "force-dynamic";

export default async function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await serverAuthService.me();

    if (!user) {
        redirect("/login");
    }

    const isEditorOrAdmin = user.roles?.some((role) =>
        ["admin", "editor"].includes(role.name.toLowerCase())
    );

    if (!isEditorOrAdmin) {
        redirect("/404");
    }

    return <>{children}</>;
}
