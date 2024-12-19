import { useState } from 'react'
import { Route, Routes, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material'; 
import StepSelectComputation from './steps/StepSelectComputation';
import StepSetParameters from './steps/StepSetParameters';
import StepSelectData from './steps/StepSelectData';
import StepAddNotes from './steps/StepAddNotes';
import ConsortiumWizardNavBar from './ConsortiumWizardNavBar';
import { ConsortiumDetailsProvider } from '../ConsortiumDetails/ConsortiumDetailsContext';
import { consortiumLeave } from '../../apis/centralApi/consortiumLeave';

const ConsortiumWizard = () => {
    const [step, setStep] = useState<number>(0); // Step index starts at 0
    const navigate = useNavigate();

    const steps = [
        { label: 'Select Computation', path: 'step-select-computation' },
        { label: 'Set Parameters', path: 'step-set-parameters' },
        { label: 'Select Data', path: 'step-select-data' },
        { label: 'Add Leader Notes', path: 'step-add-notes' },
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
            navigate(steps[step + 1].path);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
            navigate(steps[step - 1].path);
        }
    };

    const handleStepNav = (path:string) => {
        if (path) {
            navigate(path);
        }
    }

    const { consortiumId } = useParams<{ consortiumId: string }>();

    // Handler to navigate to consortium control panel
    const handleNavigateToConsortiumDetails = () => {
        if (consortiumId) {
            navigate(`/consortium/details/${consortiumId}`);
        }
    };

    return (
        <Box style={{
            margin: '2rem 2rem 0',
            padding: '2rem 1rem',
            background: 'white',
            borderRadius: '1rem',
            height: 'calc(100vh - 13rem)'
        }}>
            <ConsortiumWizardNavBar steps={steps} currentStep={step} handleStepNav={handleStepNav} />
            <Box style={{margin: '2rem 1rem 1rem'}}>
                <Typography variant="h5" gutterBottom>
                    Consortium Wizard: <span style={{color: 'black'}}>
                        Step {step + 1}: {steps[step].label}
                    </span>
                </Typography>
            </Box>
            {/* Step Routes */}
            <Box style={{margin: '0 1rem 1rem'}}>   
                <Routes>
                    <Route path="/" element={<Navigate to={steps[0].path} replace />} />
                    <Route path="step-select-computation" element={<StepSelectComputation />} />
                    <Route path="step-set-parameters" element={<StepSetParameters />} />
                    <Route path="step-select-data" element={<StepSelectData />} />
                    <Route path="step-add-notes" element={<StepAddNotes />} />
                </Routes>
            </Box>
            {/* Control Panel Buttons */}
            <Box
                sx={[{
                    position: 'absolute',
                    bottom: '4rem',
                    width: 'calc(100% - 8rem)',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0 1rem'},
                    step === 0 ?
                    {justifyContent: 'flex-end'} :
                    {justifyContent: 'space-between'}
                ]}>
                {step > 0 && <Button
                    variant="contained"
                    onClick={handleBack}>
                    Go Back A Step
                </Button>}
                {step != steps.length - 1 ? <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={step >= steps.length - 1}
                >
                Go To Next Step
                </Button>:
                <Button
                variant='outlined'
                color="primary"
                size="small"
                onClick={handleNavigateToConsortiumDetails}
                >
                View Consortium Details
                </Button>}
            </Box>
        </Box>
    );
};


// Wrapped version with the Provider
export default function ConsortiumWizardWithProvider() {
    return (
        <ConsortiumDetailsProvider>
            <ConsortiumWizard />
        </ConsortiumDetailsProvider>
    );
}
