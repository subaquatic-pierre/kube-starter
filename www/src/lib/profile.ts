import { UPDATE_PROFILE } from './endpoints';
import { strapiReqWithAuth } from './api';

export const updateProfile = async (values: any, profileId: string) => {
  const updateProfileRes = await strapiReqWithAuth<any>({
    endpoint: UPDATE_PROFILE(profileId),
    method: 'PUT',
    data: { data: values },
  });

  if (updateProfileRes.error) {
    throw new Error(updateProfileRes.error.message);
  }

  return updateProfileRes;
};
