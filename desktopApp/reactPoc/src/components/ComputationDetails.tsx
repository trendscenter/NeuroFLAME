import { gql } from "@apollo/client";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import { useUserState } from "../contexts/UserStateContext";

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
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Computation Details</h1>
            <div>
                <label>Title:</label>
                <input
                    disabled={!isOwner}
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Image Name:</label>
                <input
                    disabled={!isOwner}
                    type="text"
                    value={editableImageName}
                    onChange={(e) => setEditableImageName(e.target.value)}
                />
            </div>
            <div>
                <label>Image Download URL:</label>
                <input
                    disabled={!isOwner}
                    type="text"
                    value={editableImageDownloadUrl}
                    onChange={(e) => setEditableImageDownloadUrl(e.target.value)}
                />
            </div>
            <div>
                <label>Notes:</label>
                <textarea
                    disabled={!isOwner}
                    value={editableNotes}
                    onChange={(e) => setEditableNotes(e.target.value)}
                />
            </div>
            {isOwner && (
                <button onClick={updateComputation} disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </button>
            )}
            <div>
                <label>Owner: </label>
                {computationOwnerId}
            </div>
        </div>
    );
}
