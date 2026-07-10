export const metadata = {
  title: "HumanAI",
  description: "AI companion chat, feed, discover, and video call app",
  manifest: "/manifest.json",
  themeColor: "#1B1025",
};

function RegisterSW() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `,
      }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, background: "#0F0817" }}>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
