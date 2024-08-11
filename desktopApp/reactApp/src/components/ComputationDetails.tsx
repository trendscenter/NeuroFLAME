import { gql } from "@apollo/client";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { useUserState } from "../contexts/UserStateContext";
import TextareaAutosize from 'react-textarea-autosize';
import Card from '@mui/material/Card';
import styles from './styles';

const GET_COMPUTATION_DETAILS_QUERY = gql`
  query GetComputationDetails($computationId: String!) {
    getComputationDetails(computationId: $computationId) {
      title
      imageName
      imageDownloadUrl
      notes
      owner
    }
  }
`;

const COMPUTATION_EDIT_MUTATION = gql`
  mutation computationEdit(
    $computationId: String!
    $title: String!
    $imageName: String!
    $imageDownloadUrl: String!
    $notes: String!
  ) {
    computationEdit(
      computationId: $computationId
      title: $title
      imageName: $imageName
      imageDownloadUrl: $imageDownloadUrl
      notes: $notes
    )
  }
`;

// Define custom styles
const customStyles = {
    labelBetween: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    }
}; 

export default function ComputationDetails() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const { userId } = useUserState();
    const { computationId } = useParams<{ computationId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editableTitle, setEditableTitle] = useState("");
    const [editableImageName, setEditableImageName] = useState("");
    const [editableImageDownloadUrl, setEditableImageDownloadUrl] = useState("");
    const [editableNotes, setEditableNotes] = useState("");
    const [computationOwnerId, setComputationOwnerId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchComputationDetails = async () => {
            try {
                const result = await centralApiApolloClient?.query({
                    query: GET_COMPUTATION_DETAILS_QUERY,
                    variables: { computationId },
                });

                if (result?.data?.getComputationDetails) {
                    const details = result.data.getComputationDetails;
                    setEditableTitle(details.title);
                    setEditableImageName(details.imageName);
                    setEditableImageDownloadUrl(details.imageDownloadUrl);
                    setEditableNotes(details.notes);
                    setComputationOwnerId(details.owner);
                } else {
                    setError("Failed to fetch computation details");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComputationDetails();
    }, [computationId, centralApiApolloClient]);

    const isOwner = computationOwnerId === userId;

    const updateComputation = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await centralApiApolloClient?.mutate({
                mutation: COMPUTATION_EDIT_MUTATION,
                variables: {
                    computationId,
                    title: editableTitle,
                    imageName: editableImageName,
                    imageDownloadUrl: editableImageDownloadUrl,
                    notes: editableNotes,
                },
            });

            if (!result?.data.computationEdit) {
                setError("Failed to update computation");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            navigate('/computations')
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div style={customStyles.labelBetween}>
                <h1>Computation Details</h1>
                <div>
                    <button onClick={() => navigate('/computations')}>Back to Computations List</button>
                </div>
            </div>
            <Card sx={styles.card}>
                <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label><b>Owner: </b></label>
                    <span>{computationOwnerId}</span>
                </div>
                <div className="form-group">
                    <label><b>Title:</b></label>
                    <input
                        style={{ width: "100%" }}

                        disabled={!isOwner}
                        type="text"
                        value={editableTitle}
                        onChange={(e) => setEditableTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label><b>Image Name:</b></label>
                    <input
                        style={{ width: "100%" }}
                        disabled={!isOwner}
                        type="text"
                        value={editableImageName}
                        onChange={(e) => setEditableImageName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label><b>Image Download URL:</b></label>
                    <input
                        style={{ width: "100%" }}
                        disabled={!isOwner}
                        type="text"
                        value={editableImageDownloadUrl}
                        onChange={(e) => setEditableImageDownloadUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label><b>Notes:</b></label>
                    <textarea
                        disabled={!isOwner}
                        value={editableNotes}
                        onChange={(e) => setEditableNotes(e.target.value)}
                        style={{ width: "100%" }}
                        rows={10} // Adjust the number of rows as needed to make the textarea larger
                        cols={50} // Adjust the number of columns as needed to make the textarea wider
                    />
                </div>
                {isOwner && (
                    <button onClick={updateComputation} disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                )}
            </Card>
        </div>
    );
}
