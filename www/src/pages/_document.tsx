import { Html, Head, Main, NextScript } from 'next/document';

const HOST = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_URL ?? '';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/png" href={`${HOST}/favicon.png`} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="Kube Starter" />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${HOST}/logo-banner.jpg`} />
        <meta property="og:title" content="Kube Starter" />
        <meta property="og:description" content="Kube Starter" />
        <meta property="og:url" content={`${HOST}`} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap&family=Public+Sans:wght@400;500;600;700"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
