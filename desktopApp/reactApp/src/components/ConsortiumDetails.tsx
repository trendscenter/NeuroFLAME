import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import MemberAvatar from './MemberAvatar';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from  '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckedIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import parse from 'html-react-parser';
import DataChooser from './ComputationDetailsElements/DataChooser';
import MarkDownFromURL from './ComputationDetailsElements/MarkDownFromURL';
import RunListByConsortiumId from './ComputationDetailsElements/RunListByConsortiumId';
import ReactMarkdown from 'react-markdown'
import { CompConfig } from "./ComputationDetailsElements/CompConfig";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useUserState } from '../contexts/UserStateContext';

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


// Define custom styles
const customStyles = {
    h3 : {
      marginBottom: '0.5rem'
    },
    rowStyleTwoCols: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumn: '1',
      gap: '2rem',
      alignItems: 'center',
      gridAutoRows: 'auto',
      marginBottom: '10px',
    },
    rowStyleThreeCols: {
      display: 'grid',
      gridTemplateColumns: '3fr 3fr 3fr',
      gridColumn: '1',
      gap: '2rem',
      gridAutoRows: 'auto',
      marginBottom: '10px',
    },
    rowStyleHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumn: '1',
      gap: '2rem',
      alignItems: 'center',
      gridAutoRows: 'auto',
      marginBottom: '2rem'
    },
    container: {
      background: '#ffffff',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    containerSelfHeight: {
      background: '#ffffff',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1rem',
      height: 'fit-content',
    },
    labelBetween: {
      whiteSpace: 'nowrap',
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
    }
  };  


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

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{'list': 'bullet'}],
        ],
      };
    
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
      ];

    // Handle loading and error states for the queries
    if (loading || computationsLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (computationsError) return <p>Error: {computationsError.message}</p>;

    // Extract data from the query result
    const consortiumDetails = data?.getConsortiumDetails;
    const computations = computationsData?.getComputationList;

    const renderMembers = (members, admin, active) =>
        members.map((member, index) => {
        return( 
            <MemberAvatar 
                key={index}
                index={index}
                username={member.username} 
                admin={member.username === admin} 
                active={active.find(el => el['username'] === member.username)} />
        )
    });

    return (
        <div>
            <div style={customStyles.rowStyleThreeCols}>
                <section>
                    <div style={{marginBottom: '1rem'}}>
                      <small>Consortium:</small>
                      <h1 style={{fontSize: '2.25rem', marginBottom: '0'}}>{consortiumDetails.title}</h1>
                      <div style={{whiteSpace: 'normal'}}>{consortiumDetails.description}</div>
                    </div>
                    {editableMountDir && userIsLeader && <div>
                        <button onClick={handleStartRun} style={{width: '100%', borderRadius: '2rem', marginBottom: '1rem', backgroundColor: '#2FB600'}}>Start Run</button>
                    </div>}
                    {!userIsMember &&
                        <button onClick={async () => { await handleJoinConsortium(consortiumDetails.id) }} style={{width: '100%', borderRadius: '2rem', marginBottom: '1rem', backgroundColor: '#2FB600'}}>Join</button>
                    }
                    {userIsMember && <DataChooser setMount={setEditableMountDir} handleSetMount={handleSetMountDir} mountDir={editableMountDir} />}
                    <div style={customStyles.container}>
                      <div style={customStyles.labelBetween}>
                        <h3 style={customStyles.h3}>Members</h3>
                        <div>
                          <span style={{marginRight: '0.25rem'}}>
                              {userId && userIsActive && 
                                  <UnpublishedIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => { handleSetActive(false) }} />
                              }
                              {userId && userIsMember && !userIsActive && 
                                  <CheckedIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => { handleSetActive(true) }} />
                              }
                          </span>
                          <span>
                              {userIsMember && !userIsLeader && 
                                <CancelIcon style={{ color: 'lightpink' }} onClick={() => { handleLeaveConsortium(consortiumDetails.id) }} />
                              }
                          </span>
                        </div>
                      </div>
                      {renderMembers(consortiumDetails.members, consortiumDetails.leader.username, consortiumDetails.activeMembers)}
                    </div>
                    {showNotes && <div style={customStyles.container}>
                        <div style={customStyles.labelBetween}>
                          <h3 style={customStyles.h3}>Leader Notes</h3>
                          {userIsLeader && <div>
                            {editMode ? 
                            <div>
                            <SaveIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleSetNotes} />
                            <CancelIcon style={{ color: 'lightpink' }} onClick={() => {setEditMode(!editMode)}} />
                            </div> : 
                            <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setEditMode(!editMode)}} />}
                          </div>}
                        </div>
                        {editMode ? <ReactQuill theme="snow" value={editableNotes} onChange={setEditableNotes} modules={modules} formats={formats}></ReactQuill> : <div>{parse(editableNotes)}</div>}
                    </div>}
                </section>

                <section>
                  <RunListByConsortiumId consortiumId={consortiumId} />
                  <div style={customStyles.container}>
                    <h3 style={customStyles.h3}>Settings</h3>
                    <CompConfig parameters={editableParameters} setEditableParams={setEditableParameters} setParameters={handleSetParameters} isLeader={userIsLeader} />
                  </div>
                </section>

                <section style={customStyles.containerSelfHeight}>
                    {consortiumDetails && consortiumDetails.studyConfiguration.computation && 
                      <div>
                        <small>Computation:</small>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                          <h2 style={{color: '#000000', marginBottom: '0', marginRight: '0.5rem'}}>
                              {consortiumDetails.studyConfiguration.computation.title}
                          </h2>
                          {userIsLeader && <div>
                          {!selectComputation ? 
                          <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setSelectComputation(!selectComputation)}} /> :
                          <CancelIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setSelectComputation(!selectComputation)}} />}
                          </div>}
                        </div>
                      </div>}
                      {selectComputation && <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'flex-start'}}>
                        <select
                            value={selectableComputation}
                            onChange={(e) => setSelectableComputation(e.target.value)}
                            style={{marginRight: '1rem', height: '2.5rem', width: 'auto'}}
                        >
                            <option value="" disabled>Select computation</option>
                            {computations && computations.map((comp: any) => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.title}
                                </option>
                            ))}
                        </select>
                        <button style={{height: '2.5rem'}} onClick={handleSetComputation}>Set</button>
                    </div>}
                    {consortiumDetails && (
                        <div>
                            {consortiumDetails.studyConfiguration.computation && (
                              <div>
                              {consortiumDetails.studyConfiguration.computation.notes && 
                              <div><ReactMarkdown children={consortiumDetails.studyConfiguration.computation.notes} /></div>}
                              </div>
                            )}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
