import { getServerSession } from "next-auth";
import { authOptions } from "@/components/ui/auth";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CountryPhoneManager } from "@/components/admin/CountryPhoneManager";

export default async function AdminControlsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unauthorized</AlertTitle>
        <AlertDescription>Login required.</AlertDescription>
      </Alert>
    );
  }

  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!me || me.role !== "ROOT") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Forbidden</AlertTitle>
        <AlertDescription>Admin privileges required.</AlertDescription>
      </Alert>
    );
  }

  const countries = await prisma.countryPhone.findMany({
    orderBy: [{ current: "desc" }, { createdAt: "desc" }],
    select: { id: true, countryName: true, countryCode: true, apiCountryName: true, current: true, createdAt: true },
  });

  return <CountryPhoneManager initialCountries={countries} />;
}

