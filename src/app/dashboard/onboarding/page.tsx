import { getOnboardingStatus } from "@/app/actions/settings";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const user = await requireUser();
  const onboardingDone = await getOnboardingStatus(user.id);
  if (onboardingDone) redirect("/dashboard");

  return <OnboardingWizard />;
}
