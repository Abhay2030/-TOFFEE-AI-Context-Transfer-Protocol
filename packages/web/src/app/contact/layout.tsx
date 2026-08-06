import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Toffee AI',
  description: 'Get in touch with the Toffee AI team for support, enterprise inquiries, or general questions about AI context transfer.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
