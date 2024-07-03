import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import MemberAvatar from './MemberAvatar';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from  '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import parse from 'html-react-parser';
import DataChooser from './ComputationDetailsElements/DataChooser';
import MarkDownFromURL from './ComputationDetailsElements/MarkDownFromURL';
import { CompConfigAdmin } from "./ComputationDetailsElements/CompConfig";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

// Define custom styles
const customStyles = {
    h3 : {
      marginBottom: '0.5rem'
    },
    rowStyleThreeCols: {
      display: 'grid',
      gridTemplateColumns: '3fr 3fr 2fr',
      gridColumn: '1',
      gap: '2rem',
      gridAutoRows: 'auto',
      marginBottom: '10px',
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
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        handleGetConsortiumDetails();
        handleGetMountDir()
    }, [consortiumId]);

    useEffect(() => {
        if (data && data.getConsortiumDetails) {
            setEditableNotes(data.getConsortiumDetails.studyConfiguration.consortiumLeaderNotes || "");
            setEditableParameters(data.getConsortiumDetails.studyConfiguration.computationParameters || editableParameters);
        }
    }, [data]);

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
            <div style={customStyles.rowStyleTwoCols}>
                <div>
                    <h1 style={{marginBottom: '0'}}>{consortiumDetails.title}</h1>
                    {consortiumDetails && consortiumDetails.studyConfiguration.computation && 
                    <div style={{display: 'flex', alignItems: 'center', width: '34svw', marginBottom: '1rem'}}>
                      <h3 style={{color: '#000000', marginBottom: '0', marginRight: '0.5rem'}}>
                          {consortiumDetails.studyConfiguration.computation.title}
                      </h3>
                      {!selectComputation ? 
                      <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setSelectComputation(!selectComputation)}} /> :
                      <CancelIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setSelectComputation(!selectComputation)}} />}
                    </div>} 
                    {selectComputation && <div style={{display: 'flex', alignItems: 'center', width: '34svw', marginBottom: '1rem'}}>
                        <select
                            value={selectableComputation}
                            onChange={(e) => setSelectableComputation(e.target.value)}
                            style={{marginRight: '1rem', height: '2.5rem'}}
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
                </div>
                <div>
                {consortiumDetails && <h3 style={{color: '#000000'}}>
                    <a href={consortiumDetails.studyConfiguration.computation.imageDownloadUrl} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LinkIcon style={{color: 'black'}} /> {consortiumDetails.studyConfiguration.computation.imageDownloadUrl}
                    </a>
                </h3>}
                </div>
            </div>
            <div style={customStyles.rowStyleThreeCols}>
                <section style={customStyles.containerSelfHeight}>
                    <h3>Computation Description</h3>
                    {consortiumDetails && (
                        <div>
                            {consortiumDetails.studyConfiguration.computation && (
                              <div>
                              {consortiumDetails.studyConfiguration.computation.imageDownloadUrl.includes("github") ?
                              <div>{<MarkDownFromURL url={consortiumDetails.studyConfiguration.computation.imageDownloadUrl} />}</div> :
                              <div><p>{consortiumDetails.studyConfiguration.computation.notes}</p></div>}
                              </div>
                            )}
                        </div>
                    )}
                </section>


                <section>
                    <h3 style={customStyles.h3}>Settings</h3>
                    <CompConfigAdmin consortiumId={consortiumId} parameters={editableParameters} setEditableParams={setEditableParameters} setParameters={handleSetParameters} /> 
                </section>

                <section>
                    {editableMountDir && <div>
                        <button onClick={handleStartRun} style={{width: '100%', borderRadius: '2rem', marginBottom: '1rem', backgroundColor: '#2FB600'}}>Start Run</button>
                    </div>}
                    <div style={customStyles.container}>
                      <h3 style={customStyles.h3}>Members</h3>
                        {renderMembers(consortiumDetails.members, consortiumDetails.leader.username, consortiumDetails.activeMembers)}
                    </div>
                    <div style={customStyles.container}>
                        <div style={customStyles.labelBetween}><h3 style={customStyles.h3}>Leader Notes</h3>
                        {editMode ? <SaveIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={handleSetNotes} /> : <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setEditMode(!editMode)}} />}</div>
                        {editMode ? <ReactQuill theme="snow" value={editableNotes} onChange={setEditableNotes} modules={modules} formats={formats}></ReactQuill> : <div>{parse(editableNotes)}</div>}
                    </div>
                    <DataChooser setMount={setEditableMountDir} handleSetMount={handleSetMountDir} mountDir={editableMountDir} />
                </section>
            </div>
        </div>
    );
}
