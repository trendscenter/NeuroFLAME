import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import CompConfig from "./ConsortiumDetailsElements/CompConfig";
import ComputationPanel from "./ConsortiumDetailsElements/ComputationPanel";
import DataChooser from './ConsortiumDetailsElements/DataChooser';
import MembersPanel from "./ConsortiumDetailsElements/MembersPanel";
import NotesEditor from './ConsortiumDetailsElements/NotesEditor';
import RunListByConsortiumId from './ConsortiumDetailsElements/RunListByConsortiumId';

import { useUserState } from '../contexts/UserStateContext';

import styles from './styles';

// Define the GraphQL queries and mutations
const GET_CONSORTIUM_DETAILS = gql`
  query GetConsortiumDetails($consortiumId: String!) {
    getConsortiumDetails(consortiumId: $consortiumId) {
      id
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

const CONSORTIUM_SET_MEMBER_ACTIVE = gql`
    mutation consortiumSetmMemberActive($consortiumId: String!, $active: Boolean!) {
        consortiumSetMemberActive(consortiumId: $consortiumId, active: $active)
    }
`;

export const JOIN_CONSORTIUM = gql`
  mutation consortiumJoin($consortiumId: String!) {
    consortiumJoin(consortiumId: $consortiumId)
  }
`;

export const LEAVE_CONSORTIUM = gql`
  mutation consortiumLeave($consortiumId: String!) {
    consortiumLeave(consortiumId: $consortiumId)
  }
`;

const CONSORTIUM_EDIT_MUTATION = gql`
  mutation ConsortiumEdit($consortiumId: String!, $title: String!, $description: String!) {
    consortiumEdit(consortiumId: $consortiumId, title: $title, description: $description)
  }
`;

export default function ConsortiumDetails(props: any) {
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext);
    const { consortiumId } = useParams<{ consortiumId: string }>();
    const [editableNotes, setEditableNotes] = useState("");
    const [editableParameters, setEditableParameters] = useState("");
    const [selectableComputation, setSelectableComputation] = useState("");
    const [editableMountDir, setEditableMountDir] = useState("");
    const [selectComputation, setSelectComputation] = useState(false);
    const [userIsLeader, setUserIsLeader] = useState(false)
    const [userIsActive, setUserIsActive] = useState(false)
    const [userIsMember, setUserIsMember] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

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

    const { userId } = useUserState();

    useEffect(() => {
        handleGetConsortiumDetails();
        handleGetMountDir()
    }, [consortiumId]);

    useEffect(() => {
        setEditableParameters("");
        if (data && data.getConsortiumDetails) {
          setEditableNotes(data.getConsortiumDetails.studyConfiguration.consortiumLeaderNotes || "");
          setEditableParameters(data.getConsortiumDetails.studyConfiguration.computationParameters || "");
          if(data.getConsortiumDetails.studyConfiguration.consortiumLeaderNotes){
            setShowNotes(true)       
          }
        }
    }, [data]);

    useEffect(() => {
      setUserIsActive(data?.getConsortiumDetails?.activeMembers.some((member: any) => member.id === userId))
      setUserIsMember(data?.getConsortiumDetails?.members.some((member: any) => member.id === userId))
      setSelectComputation(!data?.getConsortiumDetails?.studyConfiguration.computation)
      if(data?.getConsortiumDetails?.leader?.id === userId){
        setShowNotes(true)
        setUserIsLeader(true)
      }
    }, [userId, data])

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
            setEditMode(!editMode);
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

    const handleJoinConsortium = async (consortiumId: string) => {
      centralApiApolloClient?.mutate({
        mutation: JOIN_CONSORTIUM,
        variables: { consortiumId: consortiumId }
      })
      handleGetConsortiumDetails();
    }

    const handleLeaveConsortium = async (consortiumId: string) => {
      console.log({ consortiumId })
      centralApiApolloClient?.mutate({
          mutation: LEAVE_CONSORTIUM,
          variables: { consortiumId: consortiumId }
      })
      handleGetConsortiumDetails();
    };

    const handleSetActive = async (newActiveValue: boolean) => {
      try {
          await centralApiApolloClient?.mutate({
              mutation: CONSORTIUM_SET_MEMBER_ACTIVE,
              variables: { consortiumId, active: newActiveValue }
          });
          console.log('Consortium set active successfully');
          handleGetConsortiumDetails();
      } catch (e) {
          console.error('Error setting consortium active:', e);
          console.log('Failed to set consortium active');
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
            <div style={styles.rowStyleThreeCols}>
                <section>
                    <div style={{marginBottom: '1rem'}}>
                      <small>Consortium:</small>
                      <h1 style={{fontSize: '2.25rem', marginBottom: '0.5rem', lineHeight: '1'}}>{consortiumDetails.title}</h1>
                      <div style={{whiteSpace: 'normal'}}>{consortiumDetails.description}</div>
                    </div>
                    {editableMountDir && userIsLeader && <div>
                        <button 
                          onClick={handleStartRun} 
                          style={{width: '100%', borderRadius: '2rem', marginBottom: '1rem', backgroundColor: '#2FB600'}}>
                            Start Run
                        </button>
                    </div>}
                    {!userIsMember &&
                        <button 
                          onClick={async () => { await handleJoinConsortium(consortiumDetails.id) }} 
                          style={{width: '100%', borderRadius: '2rem', marginBottom: '1rem', backgroundColor: '#2FB600'}}>
                            Join
                        </button>
                    }
                    {userIsMember && <DataChooser setMount={setEditableMountDir} handleSetMount={handleSetMountDir} mountDir={editableMountDir} />}
                    <MembersPanel     
                      panelstyles={styles}
                      panelConsortiumDetails={consortiumDetails}
                      panelUserId={userId}
                      panelUserIsActive={userIsActive}
                      panelUserIsLeader={userIsLeader}
                      panelUserIsMember={userIsMember}
                      panelHandleSetActive={handleSetActive}
                      panelHandleLeaveConsortium={handleLeaveConsortium}
                    />
                    {showNotes && <NotesEditor 
                      editorstyles={styles} 
                      editorHandleSetNotes={handleSetNotes} 
                      editorEditMode={editMode}
                      editorSetEditMode={setEditMode} 
                      editorEditableNotes={editableNotes} 
                      editorSetEditableNotes={setEditableNotes} 
                      editorUserIsLeader={userIsLeader}
                    />}
                </section>

                <section>
                  <RunListByConsortiumId consortiumId={consortiumId} />
                  <div style={styles.container}>
                    <h3 style={styles.h3}>Settings</h3>
                    <CompConfig 
                      configEditableParameters={editableParameters} 
                      configSetEditableParams={setEditableParameters} 
                      configHandleSetParameters={handleSetParameters} 
                      configUserIsLeader={userIsLeader} />
                  </div>
                </section>

                <section style={styles.containerSelfHeight}>
                    {consortiumDetails && consortiumDetails.studyConfiguration.computation && 
                      <ComputationPanel 
                        panelComputation={consortiumDetails.studyConfiguration.computation} 
                        panelComputations={computations} 
                        panelSelectComputation={selectComputation} 
                        panelSetSelectComputation={setSelectComputation} 
                        panelSelectableComputation={selectableComputation} 
                        panelSetSelectableComputation={setSelectableComputation} 
                        panelHandleSetComputation={handleSetComputation} 
                        panelUserIsLeader={userIsLeader} />}
                </section>

            </div>
        </div>
    );
}
