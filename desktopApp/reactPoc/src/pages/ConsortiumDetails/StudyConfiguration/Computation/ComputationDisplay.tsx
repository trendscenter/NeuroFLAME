import { Computation } from "../../../../apis/centralApi/generated/graphql";

export default function ComputationDisplay({ computation }: { computation: Computation }) {
    if(!computation) {
        return <div>
            <h1>Computation Display</h1>
            <p>No computation selected</p>
        </div>
    }
    const {
        title,
        notes,
        imageName,
        imageDownloadUrl
    } = computation
    return <div>
        <h1>Computation Display</h1>
        <div>
            <h2>Title</h2>
            <pre>{title}</pre>
        </div>
        <div>
            <h2>Image Name</h2>
            <pre>{imageName}</pre>
        </div>
        <div>
            <h2>Image Download Url</h2>
            <pre>{imageDownloadUrl}</pre>
        </div>
        <div>
            <h2>Notes</h2>
            <pre>{notes}</pre>
        </div>

    </div>
}