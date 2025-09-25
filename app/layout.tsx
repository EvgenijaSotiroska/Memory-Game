import './globals.css';


export const metadata = {
  title: 'Memory Match',
  description: 'A simple memory card game built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode })
 { 
  return ( 
  <html lang="en"> 
  <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
     <div className="mx-auto max-w-7xl px-4 py-8">{children}</div> 
     </body> 
    </html> ); 
    }

