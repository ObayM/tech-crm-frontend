import { AuthProvider } from '@/context/AuthProvider';
import './globals.css';
import { Cairo, Zain} from 'next/font/google';

const cairo = Cairo({
  subsets: ['latin'],
  weight: '500',
});

const zain = Zain({
  subsets: ['latin'],
  weight: '400',
});


export const metadata = {
  title: 'My App',
  description: 'App with Supabase Auth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${zain.className} `}>
        <AuthProvider> {/* Wrap the content */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// 230023247

