// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* On commente ou on supprime le Provider pour l'instant */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}