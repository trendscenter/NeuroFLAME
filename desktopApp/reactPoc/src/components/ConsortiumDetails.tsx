import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";

// Define the GraphQL queries and mutations
const GET_CONSORTIUM_DETAILS = gql`
  query GetConsortiumDetails($consortiumId: String!) {
    getConsortiumDetails(consortiumId: $consortiumId) {
      title
      description
      leader {
        id
        username
      }
      members {
        id
        username
      }
      activeMembers {
        id
        username
      }
      studyConfiguration {
        consortiumLeaderNotes
        computationParameters
        computation {
          title
          imageName
          imageDownloadUrl
          notes
          owner
        }
      }
    }
  }
`;

export const GET_COMPUTATION_LIST = gql`
  query GetComputationList {
    getComputationList {
      id
      title
      imageName
    }
  }
`;

export const SET_MOUNT_DIR = gql`
  mutation SetMountDir($consortiumId: String!, $mountDir: String!) {
    setMountDir(consortiumId: $consortiumId, mountDir: $mountDir)
  }
`;

export const STUDY_SET_COMPUTATION = gql`
  mutation StudySetComputation($consortiumId: String!, $computationId: String!) {
    studySetComputation(consortiumId: $consortiumId, computationId: $computationId)
  }
`;

export const STUDY_SET_PARAMETERS = gql`
  mutation StudySetParameters($consortiumId: String!, $parameters: String!) {
    studySetParameters(consortiumId: $consortiumId, parameters: $parameters)
  }
`;

export const STUDY_SET_NOTES = gql`
  mutation StudySetNotes($consortiumId: String!, $notes: String!) {
    studySetNotes(consortiumId: $consortiumId, notes: $notes)
  }
`;

export default function ConsortiumDetails(props: any) {
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext);
    const { consortiumId } = useParams<{ consortiumId: string }>();
    const [editableNotes, setEditableNotes] = useState("");
    const [editableParameters, setEditableParameters] = useState("");
    const [selectableComputation, setSelectableComputation] = useState("");
    const [editableMountDir, setEditableMountDir] = useState("")

    // Use useLazyQuery for consortium details query
    const [getConsortiumDetails, { loading, error, data }] = useLazyQuery(GET_CONSORTIUM_DETAILS, {
        client: centralApiApolloClient,
    });

    // Use useMutation for mutations
    const [setMountDir] = useMutation(SET_MOUNT_DIR, { client: centralApiApolloClient });
    const [studySetComputation] = useMutation(STUDY_SET_COMPUTATION, { client: centralApiApolloClient });
    const [studySetParameters] = useMutation(STUDY_SET_PARAMETERS, { client: centralApiApolloClient });
    const [studySetNotes] = useMutation(STUDY_SET_NOTES, { client: centralApiApolloClient });

    useEffect(() => {
        handleGetConsortiumDetails()
    }, [])


    const handleGetConsortiumDetails = () => {
        getConsortiumDetails({ variables: { consortiumId } });
    };

    const handleSetComputation = async () => {
        try {
            await studySetComputation({
                variables: { consortiumId, computationId: selectableComputation },
            });
            console.log('Computation set successfully');
            handleGetConsortiumDetails()
        } catch (e) {
            console.error('Error setting computation:', e);
            console.log('Failed to set computation');
        }
    };

    const handleSetParameters = async () => {
        try {
            await studySetParameters({
                variables: { consortiumId, parameters: editableParameters },
            });
            console.log('Parameters set successfully');
            handleGetConsortiumDetails()
        } catch (e) {
            console.error('Error setting parameters:', e);
            console.log('Failed to set parameters');
        }
    };

    const handleSetNotes = async () => {
        try {
            await studySetNotes({
                variables: { consortiumId, notes: editableNotes },
            });
            console.log('Notes set successfully');
            handleGetConsortiumDetails()
        } catch (e) {
            console.error('Error setting notes:', e);
            console.log('Failed to set notes');
        }
    };

    const handleSetMountDir = async () => {
        try {
            const mountDir = "your-mount-directory"; // Set the mount directory value
            await setMountDir({
                variables: { consortiumId, mountDir },
            });
            console.log('Mount directory set successfully');
        } catch (e) {
            console.error('Error setting mount directory:', e);
            console.log('Failed to set mount directory');
        }
    };

    // Handle loading and error states for the query
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Extract data from the query result
    const consortiumDetails = data?.getConsortiumDetails;

    return (
        <div>
            {/* <button onClick={handleGetConsortiumDetails}>Fetch Consortium Details</button> */}

            {consortiumDetails && (
                <pre>
                    <code>{JSON.stringify(consortiumDetails, null, 4)}</code>
                </pre>
            )}

            <div>
                <input
                    type="text"
                    value={editableNotes}
                    onChange={(e) => setEditableNotes(e.target.value)}
                    placeholder="Enter notes"
                />
                <button onClick={handleSetNotes}>Set Notes</button>
            </div>

            <div>
                <input
                    type="text"
                    value={editableParameters}
                    onChange={(e) => setEditableParameters(e.target.value)}
                    placeholder="Enter parameters"
                />
                <button onClick={handleSetParameters}>Set Parameters</button>
            </div>

            <div>
                <input
                    type="text"
                    value={selectableComputation}
                    onChange={(e) => setSelectableComputation(e.target.value)}
                    placeholder="Enter computation ID"
                />
                <button onClick={handleSetComputation}>Set Computation</button>
            </div>

            <div>
                <input
                    type="text"
                    value={editableMountDir}
                    onChange={(e) => setEditableMountDir(e.target.value)}
                    placeholder="Enter mount directory"
                ></input>
                <button onClick={handleSetMountDir}>Set Mount Directory</button>
            </div>
        </div>
    );
}
