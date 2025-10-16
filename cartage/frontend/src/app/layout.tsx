import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipment Tracker - Freight Management Dashboard',
  description: 'Track and manage your freight shipments with real-time updates and route visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}