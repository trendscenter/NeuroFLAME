import React from 'react';
import { useEffect, useReducer, useState } from "react";
import { Link, useParams, } from 'react-router-dom';
import parse from 'html-react-parser';
import { gql, useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import MemberAvatar from './MemberAvatar';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from  '@mui/icons-material/Cancel';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import ComputationConfigurationAdmin from './ComputationConfigurationAdmin';
import MarkDownFromURL from './MarkDownFromURL';
import ComputationContext from "../contexts/ComputationContext";
import DataChooser from './CompConfigAdmin/DataChooser';

const GET_CONSORTIUM_DETAILS = gql`
  query getConsortiumDetails($consortiumId: String!) {
    getConsortiumDetails(consortiumId: $consortiumId) {
      id
      title
      description
      administrator {
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
    }
  }
`;

const GET_COMPUTATION_CONFIGURATION = gql`
    query getComputationConfiguration($consortiumId: String!) {
        getComputationConfiguration(consortiumId: $consortiumId) {
            compSpec
            adminFormData
        }
    }   
`;

const PING_ACTIVE_MEMBERS = gql`
  mutation pingActiveMembers($consortiumId: String!) {
    pingActiveMembers(consortiumId: $consortiumId)
  }
`;

const START_RUN = gql`
  mutation startRun($consortiumId: String!) {
    startRun(consortiumId: $consortiumId)
  }
`;

const STOP_RUN = gql`
  mutation stopRun($consortiumId: String!) {
    stopRun(consortiumId: $consortiumId)
  }
`;

const ON_PING_ACTIVE_MEMBERS_SUBSCRIPTION = gql`
subscription onPingActiveMembersSubscription {
    onPingActiveMembers {
        consortiumId
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
  labelBetween: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  }
};


export default function ConsortiumDetails() {
  const { consortiumId } = useParams();
  const { loading, error, data } = useQuery(GET_CONSORTIUM_DETAILS, {
    variables: { consortiumId },
  });

  const { data: subscriptionData, error: subscriptionError, loading: subscriptionLoading } = useSubscription(ON_PING_ACTIVE_MEMBERS_SUBSCRIPTION);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: Please try again</p>}
      {data && <ConsortiumDetailContent details={data.getConsortiumDetails} />}
      <div>
        {subscriptionData && subscriptionData.onPingActiveMembers && subscriptionData.onPingActiveMembers.consortiumId && `ping from consortiumId: ${subscriptionData.onPingActiveMembers.consortiumId}`}
      </div>

    </div>
  );
}

function ConsortiumDetailContent({ details }) {
  const [compSpec, setCompSpec] = useState(null);
  const [compChanged, setCompChanged] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState("Please format your participants.tcv file with the following headers/value types:<br/><br/><strong>isControl:</strong> boolean <br/><strong>age: </strong>number <br/><strong>sex: </strong> string");
  const [computation, dispatch] = useReducer(
    computationReducer
  );

  const renderMembers = (members, admin, active) =>
    members.map((member, index) => {
      return( 
        <MemberAvatar 
          key={index}
          username={member.username} 
          admin={member.username === admin} 
          active={active.find(el => el['username'] === member.username)} />
      )
    });

  const [pingActiveMembers] = useMutation(PING_ACTIVE_MEMBERS, { variables: { consortiumId: details.id } });
  const [startRun] = useMutation(START_RUN, { variables: { consortiumId: details.id } });

  const [getComputationConfiguration] = useLazyQuery(GET_COMPUTATION_CONFIGURATION);

  const loadComputationConfiguration = () => {
    //get it
    getComputationConfiguration({
        variables: { consortiumId: details.id }, onCompleted: (data) => {
            // parse it
            const myCompSpec = JSON.parse(data.getComputationConfiguration.compSpec);
            setCompSpec(myCompSpec);
        }
    })
  }

  useEffect(() => {
    loadComputationConfiguration()
  }, [details.id, compChanged])  

  const handleCompChange = (event) => {
    setCompChanged(event);
  }

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

  return (
    <ComputationContext.Provider value={compSpec}>
      <div style={customStyles.rowStyleTwoCols}>
        <div>
          <h1 style={{marginBottom: '0'}}>{details.title}</h1>
          {compSpec && compSpec.edgeNodeSpec.docker && <h3 style={{color: '#000000'}}>{compSpec.edgeNodeSpec.docker.image}</h3>}
        </div>
        <div>
          {compSpec && <h3 style={{color: '#000000'}}>
            <a href={"https://"+compSpec.repository} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <LinkIcon />
              {compSpec.repository}
            </a>
          </h3>}
        </div>     
      </div>
      <div style={customStyles.rowStyleThreeCols}>
        <div style={customStyles.container}>
          <h3 style={customStyles.h3}>Computation Description</h3>
          {compSpec && <MarkDownFromURL url={compSpec.repository} />}
        </div>
        <div style={customStyles.container}>
          <h3 style={customStyles.h3}>Settings</h3>
          <ComputationConfigurationAdmin consortiumId={details.id} onChangeComputationConfigurationAdmin={handleCompChange} />
        </div>
        <div>
          <div style={customStyles.container}>
            {renderMembers(details.members, details.administrator.username, details.activeMembers)}
          </div>
          <div style={customStyles.container}>
              <div style={customStyles.labelBetween}><h3 style={customStyles.h3}>Notes</h3>
              {editMode ? <CancelIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setEditMode(!editMode)}} /> : <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {setEditMode(!editMode)}} />}</div>
              {editMode ? <ReactQuill theme="snow" value={notes} onChange={setNotes} modules={modules} formats={formats}></ReactQuill> : <div style={{minHeight: '135px'}}>{parse(notes)}</div>}
          </div>
          <DataChooser />
          {/* <button onClick={startRun} style={{width: '100%', borderRadius: '2rem'}}>
            Start Run
          </button> */}
        </div>
      </div>
    </ComputationContext.Provider>
  );
}

function computationReducer(computation, action) {
  switch (action.type) {
    case 'changed' : {
      return [...computation, {
        id: action.id,
      }];
    }
  }
}