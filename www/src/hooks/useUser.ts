// next

interface UserProps {
  name: string;
  email: string;
  avatar: string;
  thumb: string;
  role: string;
}

const useUser = () => {
  const newUser: UserProps = {
    name: 'Fixed User',
    email: 'wrong@email.com',
    avatar: '',
    thumb: '',
    role: 'UI/UX Designer'
  };

  return newUser;
};

export default useUser;
