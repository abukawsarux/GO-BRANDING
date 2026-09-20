import { getOrCreateDefaultWorkspace } from "@/core/auth/context";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { workspace, brand, credits } = await getOrCreateDefaultWorkspace();

  return (
    <DashboardOverview
      workspaceName={workspace.name}
      brandName={brand?.name || "LUMINA CO."}
      credits={credits}
    />
  );
}
