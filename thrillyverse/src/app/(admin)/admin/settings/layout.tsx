import AdminFrame from '@/components/layout/AdminFrame';

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminFrame>{children}</AdminFrame>;
}