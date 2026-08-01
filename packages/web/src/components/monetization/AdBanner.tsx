"use client";

import { useEffect } from "react";

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  const pId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle || [];
        const adContainer = document.querySelector(`ins[data-ad-slot="${dataAdSlot}"]`);
        if (adContainer && adContainer.innerHTML === "") {
          adsbygoogle.push({});
        }
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [dataAdSlot]);

  if (!pId) return null;

  return (
    <div className="w-full overflow-hidden flex justify-center py-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={pId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}
