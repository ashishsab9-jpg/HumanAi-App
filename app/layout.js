export const metadata = {
  title: "HumanAI",
  description: "AI Friends App",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0f0f17" }}>
        {children}
      </body>
    </html>
  );
}
