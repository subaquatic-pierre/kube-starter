import TwitterIcon from '@mui/icons-material/X';
import FaceBookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MobileIcon from '@mui/icons-material/MobileFriendly';
import PhoneNumberIcon from '@mui/icons-material/PhoneCallback';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

import { SiteSettings } from 'models/settings';

interface ContactItem {
  icon: React.ReactElement;
  title: string;
  link: string;
}

export const buildContactItems = (settings: SiteSettings): ContactItem[] => {
  const fabActions: ContactItem[] = [];
  if (settings.facebook) {
    fabActions.push({
      title: 'Facebook',
      link: settings.facebook,
      icon: <FaceBookIcon />
    });
  }
  if (settings.linkedIn) {
    fabActions.push({
      title: 'LinkedIn',
      link: settings.linkedIn,
      icon: <LinkedInIcon />
    });
  }
  if (settings.mobileNumber) {
    fabActions.push({
      title: 'Mobile Number',
      link: `tel:${settings.mobileNumber}`,
      icon: <MobileIcon />
    });
  }
  if (settings.phoneNumber) {
    fabActions.push({
      title: 'Phone Number',
      link: `tel:${settings.phoneNumber}`,
      icon: <PhoneNumberIcon />
    });
  }
  if (settings.whatsapp) {
    fabActions.push({
      title: 'WhatsApp',
      link: settings.whatsapp,
      icon: <WhatsAppIcon />
    });
  }
  if (settings.twitter) {
    fabActions.push({
      title: 'Twitter',
      link: settings.twitter,
      icon: <TwitterIcon />
    });
  }
  if (settings.email) {
    fabActions.push({
      title: 'Email',
      link: `mailto:${settings.email}`,
      icon: <EmailIcon />
    });
  }

  return fabActions;
};
