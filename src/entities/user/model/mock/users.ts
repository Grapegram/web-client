import type { User } from '@/entities/user';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    password: '',
    isVerified: true,
    bio: 'Software engineer and tech enthusiast',
    avatar: undefined,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: '',
    isVerified: true,
    bio: 'Product designer at TechCorp',
    avatar: undefined,
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    username: 'alex_johnson',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: '',
    isVerified: false,
    bio: 'Full-stack developer',
    avatar: undefined,
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    username: 'sarah_williams',
    displayName: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    password: '',
    isVerified: true,
    bio: 'UX researcher and design advocate',
    avatar: undefined,
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    username: 'mike_brown',
    displayName: 'Mike Brown',
    email: 'mike.brown@example.com',
    password: '',
    isVerified: false,
    bio: 'Mobile app developer',
    avatar: undefined,
    createdAt: new Date('2023-05-12')
  },
  {
    id: '6',
    username: 'emily_davis',
    displayName: 'Emily Davis',
    email: 'emily.davis@example.com',
    password: '',
    isVerified: true,
    bio: 'DevOps engineer | Cloud enthusiast',
    avatar: undefined,
    createdAt: new Date('2023-06-18')
  },
  {
    id: '7',
    username: 'chris_wilson',
    displayName: 'Chris Wilson',
    email: 'chris.wilson@example.com',
    password: '',
    isVerified: false,
    bio: 'Frontend specialist',
    avatar: undefined,
    createdAt: new Date('2023-07-22')
  },
  {
    id: '8',
    username: 'lisa_martinez',
    displayName: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    password: '',
    isVerified: true,
    bio: 'Data scientist and ML engineer',
    avatar: undefined,
    createdAt: new Date('2023-08-30')
  },
  {
    id: '9',
    username: 'david_anderson',
    displayName: 'David Anderson',
    email: 'david.anderson@example.com',
    password: '',
    isVerified: false,
    bio: 'Backend developer',
    avatar: undefined,
    createdAt: new Date('2023-09-14')
  },
  {
    id: '10',
    username: 'jessica_taylor',
    displayName: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    password: '',
    isVerified: true,
    bio: 'Tech lead | Open source contributor',
    avatar: undefined,
    createdAt: new Date('2023-10-08')
  }
];

export const initializeMockUsers = () => {
  return mockUsers;
};
