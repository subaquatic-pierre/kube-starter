import { Html, Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';

const HOST = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_URL;

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${HOST}/images/favicon/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${HOST}/images/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${HOST}/images/favicon/favicon-16x16.png`}
        />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Ras Al Khaimah's First International Forensic Sciences Conference is not just another academic gathering. It's where the tradition of excellence in the UAE meets the evolving world of forensics"
        />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${HOST}/images/landingBanner.jpg`}
        />
        <meta
          property="og:title"
          content="Ras Al Khaimah’s First International Forensic Sciences Conference"
        />
        <meta
          property="og:description"
          content="Ras Al Khaimah's First International Forensic Sciences Conference is not just another academic gathering. It's where the tradition of excellence in the UAE meets the evolving world of forensics"
        />
        <meta property="og:url" content={`${HOST}`} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap&family=Public+Sans:wght@400;500;600;700"
          rel="stylesheet"
        />
        {/* <meta
          http-equiv="Content-Security-Policy"
          content="
      worker-src blob:; 
      child-src blob: gap:;
      img-src 'self' blob: data:;
      default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:"
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
