import DashboardLayout from "@/components/layouts/dashboard-layout";

import KelolaGedungSection from "@/components/features/admin/kelola-gedung/kelola-gedung-section";

export default function GedungPage() {
  return (
    <DashboardLayout>
      <KelolaGedungSection />
    </DashboardLayout>
  );
}
