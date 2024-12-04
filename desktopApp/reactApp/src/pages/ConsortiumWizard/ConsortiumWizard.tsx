import { Route, Routes } from 'react-router-dom';
import StepSelectComputation from './steps/StepSelectComputation';
import StepSetParameters from './steps/StepSetParameters';
import StepSelectData from './steps/StepSelectData';
import StepStartRun from './steps/StepStartRun';
import ConsortiumWizardNavBar from './ConsortiumWizardNavBar';
import { ConsortiumDetailsProvider, } from '../ConsortiumDetails/ConsortiumDetailsContext';


const ConsortiumWizard = () => {
    return (
        <>
            <ConsortiumWizardNavBar />
            <Routes>
                <Route path="step-select-computation" element={<StepSelectComputation />} />
                <Route path="step-set-parameters" element={<StepSetParameters />} />
                <Route path="step-select-data" element={<StepSelectData />} />
                <Route path="step-start-run" element={<StepStartRun />} />
            </Routes>
        </>
    );
};



export default function ConsortiumWizardWithProvider() {
    return <ConsortiumDetailsProvider>
        <ConsortiumWizard></ConsortiumWizard>
    </ConsortiumDetailsProvider>

}