import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: 'STUDENT' | 'ADMIN' | string;
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const defaultUser: User = {
  firstName: 'Пупсик',
  lastName: 'Пупсикович',
  avatar: null,
  role: 'ADMIN',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
