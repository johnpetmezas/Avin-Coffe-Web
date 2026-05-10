import './globals.css';

export const metadata = {
  title: 'AVIN Solomos - Unified Coffee',
  description: 'Order your coffee easily from AVIN Solomos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
