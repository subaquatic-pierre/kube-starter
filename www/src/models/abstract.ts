import { UserProfile } from './auth';
import { FileUpload } from './file';
import { getKeywords } from 'lib/utils';

export type Abstract = {
  id: number;
  title: string;
  content: string | null;
  keywords: string | null;
  profile: UserProfile | null;
  document: FileUpload | null;
  video: FileUpload | null;
  documents?: FileUpload[];
};

export const reduceAbstract = (data: any) => {
  try {
    let abstract = {};
    if (data.attributes.abstract) {
      const attrs = data.attributes.abstract?.data.attributes;
      abstract = {};
      abstract['id'] = data.attributes.abstract.data.id;
      abstract = {
        ...abstract,
        ...attrs,
      };
    }
    return abstract;
  } catch (e: any) {
    return null;
  }
};
