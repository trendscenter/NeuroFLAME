import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { useUserState } from "../contexts/UserStateContext";



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

const GET_COMPUTATION_LIST = gql`
  query GetComputationList {
    getComputationList {
      id
      title
      imageName
    }
  }
`;



const STUDY_SET_COMPUTATION = gql`
  mutation StudySetComputation($consortiumId: String!, $computationId: String!) {
    studySetComputation(consortiumId: $consortiumId, computationId: $computationId)
  }
`;

const STUDY_SET_PARAMETERS = gql`
  mutation StudySetParameters($consortiumId: String!, $parameters: String!) {
    studySetParameters(consortiumId: $consortiumId, parameters: $parameters)
  }
`;

const STUDY_SET_NOTES = gql`
  mutation StudySetNotes($consortiumId: String!, $notes: String!) {
    studySetNotes(consortiumId: $consortiumId, notes: $notes)
  }
`;

const SET_MOUNT_DIR = gql`
  mutation SetMountDir($consortiumId: String!, $mountDir: String!) {
    setMountDir(consortiumId: $consortiumId, mountDir: $mountDir)
  }
`;

const GET_MOUNT_DIR = gql`
  query GetMountDir($consortiumId: String!) {
    getMountDir(consortiumId: $consortiumId)
  }
`;



const START_RUN = gql`
  mutation StartRun($input: StartRunInput!) {
    startRun(input: $input) {
      runId
    }
  }
`;


export default function ConsortiumDetails(props: any) {
    const { username, userId } = useUserState();
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext);
    const { consortiumId } = useParams<{ consortiumId: string }>();
    const [editableNotes, setEditableNotes] = useState("");
    const [editableParameters, setEditableParameters] = useState("");
    const [selectableComputation, setSelectableComputation] = useState("");
    const [editableMountDir, setEditableMountDir] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userIsLeader, setUserIsLeader] = useState(false)
    // Use useLazyQuery for consortium details query
    const [getConsortiumDetails, { loading, error, data }] = useLazyQuery(GET_CONSORTIUM_DETAILS, {
        client: centralApiApolloClient,
    });

    // Use useQuery for computation list query
    const { loading: computationsLoading, error: computationsError, data: computationsData } = useQuery(GET_COMPUTATION_LIST, {
        client: centralApiApolloClient,
    });

    // Use useMutation for mutations
    const [startRun] = useMutation(START_RUN, { client: centralApiApolloClient })
    const [setMountDir] = useMutation(SET_MOUNT_DIR, { client: edgeClientApolloClient });
    const [studySetComputation] = useMutation(STUDY_SET_COMPUTATION, { client: centralApiApolloClient });
    const [studySetParameters] = useMutation(STUDY_SET_PARAMETERS, { client: centralApiApolloClient });
    const [studySetNotes] = useMutation(STUDY_SET_NOTES, { client: centralApiApolloClient });

    useEffect(() => {
        handleGetConsortiumDetails();
        handleGetMountDir()
    }, [consortiumId]);

    useEffect(() => {
        if (data && data.getConsortiumDetails) {
            setEditableNotes(data.getConsortiumDetails.studyConfiguration.consortiumLeaderNotes || "");
            setEditableParameters(data.getConsortiumDetails.studyConfiguration.computationParameters || "");
        }
    }, [data]);

    useEffect(() => {
        setUserIsLeader(data?.getConsortiumDetails?.leader?.id === userId)
    }, [userId, data])

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute("webkitdirectory", "true");
        }
    }, []);

    const handleStartRun = async () => {
        startRun({
            variables: { input: { consortiumId } }
        })
    };

    const handleGetConsortiumDetails = () => {
        getConsortiumDetails({ variables: { consortiumId } });
    };

    const handleSetComputation = async () => {
        try {
            await studySetComputation({
                variables: { consortiumId, computationId: selectableComputation },
            });
            console.log('Computation set successfully');
            handleGetConsortiumDetails();
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
            handleGetConsortiumDetails();
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
            handleGetConsortiumDetails();
        } catch (e) {
            console.error('Error setting notes:', e);
            console.log('Failed to set notes');
        }
    };

    const handleGetMountDir = async () => {
        try {
            const result = await edgeClientApolloClient?.query({
                query: GET_MOUNT_DIR,
                variables: { consortiumId }
            });
            if (result?.data?.getMountDir) {
                setEditableMountDir(result.data.getMountDir);
            }
        } catch (e) {
            console.error("Error getting mount dir:", e);
        }
    };


    const handleSetMountDir = async () => {
        try {
            await setMountDir({
                variables: { consortiumId, mountDir: editableMountDir },
            });
            console.log('Mount directory set successfully');
        } catch (e) {
            console.error('Error setting mount directory:', e);
            console.log('Failed to set mount directory');
        }
    };

    // Handle loading and error states for the queries
    if (loading || computationsLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (computationsError) return <p>Error: {computationsError.message}</p>;

    // Extract data from the query result
    const consortiumDetails = data?.getConsortiumDetails;
    const computations = computationsData?.getComputationList;

    return (
        <div>
            <section>
                <h2>Consortium Details</h2>
                {consortiumDetails && (
                    <div>
                        <p><strong>Title:</strong> {consortiumDetails.title}</p>
                        <p><strong>Description:</strong> {consortiumDetails.description}</p>
                        <p><strong>Leader:</strong> {consortiumDetails.leader.username}</p>
                    </div>
                )}
            </section>

            <section>
                <h2>Members</h2>
                {consortiumDetails && (
                    <div>
                        <h3>Members</h3>
                        <ul>
                            {consortiumDetails.members.map((member: any) => (
                                <li key={member.id}>{member.username}</li>
                            ))}
                        </ul>
                        <h3>Active Members</h3>
                        <ul>
                            {consortiumDetails.activeMembers.map((member: any) => (
                                <li key={member.id}>{member.username}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            <section>
                <h2>Study Configuration</h2>
                {consortiumDetails && (
                    <div>
                        <div>
                            {userIsLeader && <div>
                                <label>Computation</label>
                                <select
                                    value={selectableComputation}
                                    onChange={(e) => setSelectableComputation(e.target.value)}
                                >
                                    <option value="" disabled>Select computation</option>
                                    {computations && computations.map((comp: any) => (
                                        <option key={comp.id} value={comp.id}>
                                            {comp.title}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleSetComputation}>Set Computation</button>
                            </div>
                            }
                        </div>
                        {consortiumDetails.studyConfiguration.computation && (
                            <div>
                                <h3>Computation Details</h3>
                                <p><strong>Title:</strong> {consortiumDetails.studyConfiguration.computation.title}</p>
                                <p><strong>Image Name:</strong> {consortiumDetails.studyConfiguration.computation.imageName}</p>
                                <p><strong>Image Download URL:</strong> <a href={consortiumDetails.studyConfiguration.computation.imageDownloadUrl}>{consortiumDetails.studyConfiguration.computation.imageDownloadUrl}</a></p>
                                <p><strong>Computation Notes:</strong> {consortiumDetails.studyConfiguration.computation.notes}</p>
                                <p><strong>Owner:</strong> {consortiumDetails.studyConfiguration.computation.owner}</p>
                            </div>
                        )}
                        <div>
                            <label>Consortium Leader Notes</label>
                            <div>
                                <textarea
                                    value={editableNotes}
                                    onChange={(e) => setEditableNotes(e.target.value)}
                                    placeholder="Enter notes"
                                    rows={4}
                                    cols={50}
                                    disabled={!userIsLeader}
                                />
                                {
                                    userIsLeader && <button onClick={handleSetNotes}>Set Notes</button>
                                }
                            </div>
                        </div>

                        <div>
                            <label>Parameters</label>
                            <div>
                                <textarea
                                    value={editableParameters}
                                    onChange={(e) => setEditableParameters(e.target.value)}
                                    placeholder="Enter parameters"
                                    rows={4}
                                    cols={50}
                                    disabled={!userIsLeader}
                                />
                                {
                                    userIsLeader && <button onClick={handleSetParameters}>Set Parameters</button>
                                }
                            </div>
                        </div>
                        {userIsLeader && <div>
                            <button onClick={handleStartRun}>Start Run</button>
                        </div>
                        }
                    </div>
                )}
            </section>
            <section>
                <h2>Member Settings</h2>
                <fieldset>
                    <legend>Mount Directory</legend>
                    <div>
                        <label htmlFor="mountDirInput">Enter the path of the directory to mount:</label><br />
                        <input
                            type="text"
                            id="mountDirInput"
                            value={editableMountDir}
                            onChange={(e) => setEditableMountDir(e.target.value)}
                            placeholder="Enter mount directory"
                            style={{ width: "100%" }}
                        /><br />
                    </div>
                    <div>
                        <button onClick={handleSetMountDir}>Save mount directory</button>
                    </div>
                </fieldset>
            </section>

        </div>
    );
}
