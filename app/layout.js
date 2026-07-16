export const metadata = {
  title: "Points Desk",
  description: "Loyalty points and frequent flyer miles conversion desk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0B0F17" }}>{children}</body>
    </html>
  );
}
