import { gql } from '@apollo/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ApolloClientsContext } from './ApolloClientsContext';
import { useNotifications } from './NotificationsContext';

interface UserStateContextType {
    userId: string;
    username: string;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password){
      accessToken
      userId
      username
      }
  }
`;

const CONNECT_AS_USER = gql`
  mutation ConnectAsUser {
    connectAsUser
  }
`;

export const UserStateProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string>('');
    const [_username, set_Username] = useState<string>('');
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext);
    const {subscribe, unsubscribe} = useNotifications()

    const loginToCentral = async (username: string, password: string) => {
        const result = await centralApiApolloClient?.mutate({
            mutation: LOGIN_MUTATION,
            variables: { username, password }
        })

        const accessToken = result?.data?.login?.accessToken

        localStorage.setItem("accessToken", accessToken)
        setUserId(result?.data?.login?.userId)
        set_Username(result?.data?.login?.username)
    }

    const connectAsUser = async () => {
        try {
            await edgeClientApolloClient?.mutate({
                mutation: CONNECT_AS_USER
            })
        } catch (e: any) {
            console.error(`error connecting as user ${e}`)
        }
    }

    const login = async (username: string, password: string) => {
        await loginToCentral(username, password)
        await connectAsUser()
        subscribe()
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        setUserId('')
        set_Username('')
        unsubscribe()
    }

    return (
        <UserStateContext.Provider value={{ userId, username: _username, login, logout }}>
            {children}
        </UserStateContext.Provider>
    );
};

export const useUserState = (): UserStateContextType => {
    const context = useContext(UserStateContext);
    if (context === undefined) {
        throw new Error('useUserState must be used within a UserStateProvider');
    }
    return context;
};