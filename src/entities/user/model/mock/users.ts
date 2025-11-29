import type { User } from '@/entities/user';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john.doe@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    username: 'jane_smith',

    email: 'jane.smith@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    username: 'alex_johnson',

    email: 'alex.johnson@example.com',
    isVerified: false,

    avatar: undefined,
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    username: 'sarah_williams',

    email: 'sarah.williams@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    username: 'mike_brown',

    email: 'mike.brown@example.com',
    isVerified: false,

    avatar: undefined,
    createdAt: new Date('2023-05-12')
  },
  {
    id: '6',
    username: 'emily_davis',

    email: 'emily.davis@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-06-18')
  },
  {
    id: '7',
    username: 'chris_wilson',

    email: 'chris.wilson@example.com',
    isVerified: false,

    avatar: undefined,
    createdAt: new Date('2023-07-22')
  },
  {
    id: '8',
    username: 'lisa_martinez',

    email: 'lisa.martinez@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-08-30')
  },
  {
    id: '9',
    username: 'david_anderson',

    email: 'david.anderson@example.com',
    isVerified: false,

    avatar: undefined,
    createdAt: new Date('2023-09-14')
  },
  {
    id: '10',
    username: 'jessica_taylor',

    email: 'jessica.taylor@example.com',
    isVerified: true,

    avatar: undefined,
    createdAt: new Date('2023-10-08')
  }
];

export const initializeMockUsers = () => {
  return mockUsers;
};
