import { useContext } from "react";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      userId
      username
      roles
    }
  }
`;

const CONNECT_AS_USER = gql`
  mutation ConnectAsUser {
    connectAsUser
  }
`;


const USER_CREATE = gql`
  mutation UserCreate($username: String!, $password: String!) {
    userCreate(username: $username, password: $password) {
      accessToken
      userId
      username
      roles
    }
  }
`


export const useLoginAndConnect = () => {
  const { centralApiApolloClient, edgeClientApolloClient, startClients } = useContext(ApolloClientsContext);


  const loginToCentral = async (username: string, password: string) => {
    const result = await centralApiApolloClient?.mutate({
      mutation: LOGIN_MUTATION,
      variables: { username, password }
    });

    // if the login fails, throw the errors
    if (result?.errors) {
      throw new Error(result.errors[0].message);
    }

    const { accessToken, userId, username: user, roles } = result?.data?.login;
    localStorage.setItem('accessToken', accessToken);

    return { accessToken, userId, username: user, roles }
  };

  const connectAsUser = async () => {
    try {
      await edgeClientApolloClient?.mutate({
        mutation: CONNECT_AS_USER
      });
    } catch (e: any) {
      console.error(`Error connecting as user: ${e}`);
      throw new Error('Error connecting as user');
    }
  };

  const createUser = async (username: string, password: string) => {
    try {
      const result = await centralApiApolloClient?.mutate({
        mutation: USER_CREATE,
        variables: { username, password }
      });

      console.log(result?.data)

      const { accessToken, userId, username: user, roles } = result?.data?.userCreate;
      localStorage.setItem('accessToken', accessToken);

      return { accessToken, userId, username: user, roles }
    } catch (e: any) {
      console.error(`Error creating user: ${e}`);
      throw new Error(e.message);
    }
  }


  return {
    loginToCentral,
    connectAsUser,
    createUser,
    startClients
  }
}