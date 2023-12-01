import axios from 'axios';
import { GENERATE_TICKET_URL } from './endpoints';
import { DashboardApiResponse } from 'types/api';
import { UserProfile } from 'models/auth';

const ticketGenSecret = process.env.NEXT_PUBLIC_TICKET_GEN_SECRET;

export const generateTicket = async (
  profile: Partial<UserProfile>,
  noValidate = true,
) => {
  try {
    if (noValidate) {
      if (!profile.nameOnCert) {
        throw new Error('no name on certificate');
      }

      if (profile.nameOnCert.length > 40) {
        throw new Error('cannot have name on cert greater than 28 characters');
      }

      if (!profile.institution) {
        throw new Error('no institution on certificate');
      }

      if (profile.institution.length > 135) {
        throw new Error('cannot have institution greater than 135 characters');
      }

      if (!profile.nameOnCert.match(/^[a-zA-Z ]+$/)) {
        throw new Error('name must be latin characters');
      }
    }

    const res = await axios.request<any, DashboardApiResponse>({
      method: 'POST',
      url: GENERATE_TICKET_URL,
      data: {
        secret: ticketGenSecret,
        userId: `${profile.id}`,
        ticketType: profile.user?.role?.type ?? 'organizer',
        certName: profile.nameOnCert,
        institution: profile.institution,
      },
    });

    return res.data.data;
  } catch (e: any) {
    return {
      error: { message: `${e}` },
    };
  }
};
