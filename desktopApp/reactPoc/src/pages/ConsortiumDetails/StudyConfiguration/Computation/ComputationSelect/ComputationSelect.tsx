// src/components/ComputationSelect.tsx
import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ComputationList from "./ComputationList";
import { useComputationSelect } from "./useComputationSelect";

export default function ComputationSelect() {
    const { computations, loading, error, selectComputation } = useComputationSelect();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectComputation = (computationId: string) => {
        selectComputation(computationId);
        handleCloseModal(); // Close modal after selection
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Select Computation
            </Button>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Select a Computation</DialogTitle>
                <DialogContent>
                    {loading && <p>Loading computations...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && !error && (
                        <ComputationList computations={computations} onSelect={handleSelectComputation} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
