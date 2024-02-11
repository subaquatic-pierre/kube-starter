import { User } from './auth';

export type Blog = {
  id: number;
  title: string;
  description: string;
  slug: string;
  content: object;
  featuredImageUrl?: string;
  createdAt?: Date;
  updateAt?: Date;
  author: Partial<User>;
};

export const reduceBlog = (data: any): Blog | null => {
  try {
    let blog: Blog = {
      id: data.id,
      ...data.attributes,
      createdAt: new Date(data.attributes.createdAt),
      updateAt: new Date(data.attributes.updateAt),
      content: JSON.parse(data.attributes.content),
      author: data.user
    };

    return blog;
  } catch (e) {
    console.debug('Error reducing blog', e.message);
    return null;
  }
};

export const reduceBlogs = (data: any): Blog[] | null => {
  const blogs = [];
  for (const item of data.data.data) {
    try {
      const blog = reduceBlog(item);

      if (blog) blogs.push(blog);
    } catch (e) {
      console.debug('Error reducing message', e.message);
    }
  }
  return blogs;
};
