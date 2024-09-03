export type SiteSettings = {
  title: string;
  description: string;
  externalScripts: string;
  phoneNumber: string;
  mobileNumber: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook: string;
  twitter: string;
  linkedIn: string;
  instagram: string;
  webhook: string;
  logo: string;
  favicon: string;
  host: string;
  ogMeta: MetaTag[];
  loaded: boolean;
  url?: string;
  image?: string;
};

export const defaultSiteSettings: SiteSettings = {
  title: 'Fast API NextJS Portfolio',
  description: '',
  externalScripts: '',
  phoneNumber: '',
  mobileNumber: '',
  email: '',
  whatsapp: '',
  address: '',
  facebook: '',
  twitter: '',
  linkedIn: '',
  instagram: '',
  webhook: '',
  logo: '',
  favicon: '',
  ogMeta: [],
  host: '',
  loaded: false
};

export type MetaTag = {
  title: string;
  content: string;
  property: string;
};

export type Seo = {
  title: string;
  description: string;
  image: string;
  metaTags: MetaTag[];
};

export const reduceSiteSettings = (data: any): SiteSettings => {
  try {
    let settings: SiteSettings = {
      id: data.id,
      ...data.attributes,
      loaded: true
    };

    return settings;
  } catch (e) {
    console.debug('Error reducing site settings');
    return defaultSiteSettings;
  }
};
