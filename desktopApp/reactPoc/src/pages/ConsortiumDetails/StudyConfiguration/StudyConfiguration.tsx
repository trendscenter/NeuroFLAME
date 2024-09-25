import Computation from "./Computation/Computation";
import ComputationParameters from "./ComputationParameters/ComputationParameters";
import ConsortiumLeaderNotes from "./ConsortiumLeaderNotes/ConsortiumLeaderNotes";

export function StudyConfiguration({ studyConfiguration }: { studyConfiguration: any }) {
    const { computation, computationParameters, consortiumLeaderNotes } = studyConfiguration;

    return (
        <div>
            <h1>Study Configuration</h1>
            <Computation computation={computation} />
            <ComputationParameters computationParameters={computationParameters}/>
            <ConsortiumLeaderNotes consortiumLeaderNotes={consortiumLeaderNotes} />
        </div>
    );
}