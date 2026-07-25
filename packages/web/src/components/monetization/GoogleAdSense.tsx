import Script from "next/script";

type GoogleAdSenseProps = {
  publisherId?: string;
};

export default function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  // Use passed prop or fallback to environment variable
  const pId = publisherId || process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!pId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
