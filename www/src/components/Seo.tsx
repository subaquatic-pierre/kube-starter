import { SiteSettings, defaultSiteSettings } from 'models/settings';
import Head from 'next/head';
import Script from 'next/script';

interface Props {
  settings?: SiteSettings;
  title?: string;
}
const Seo: React.FC<Props> = ({ settings, title }) => {
  if (!settings) {
    settings = defaultSiteSettings;
  }

  return (
    <>
      <Head>
        <link key="favicon" rel="icon" type="image/png" href={settings.favicon} />
        <title>{title ?? settings.title}</title>
        <meta name="description" content={settings.description} />

        {/* OG Tags */}
        <meta property="og:description" content={settings.description} />
        <meta property="og:title" content={settings.title} />
        <meta property="og:url" content={settings.url ?? settings.host} />
        <meta property="og:image" content={settings.image ?? settings.logo} />

        {/* TODO: Add more settings to model */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {settings.ogMeta.map((item, idx) => (
          <meta key={item.title} property={item.property} content={item.content} />
        ))}
      </Head>
      <Script id="externalScripts" dangerouslySetInnerHTML={{ __html: settings.externalScripts }} />
    </>
  );
};

export default Seo;
