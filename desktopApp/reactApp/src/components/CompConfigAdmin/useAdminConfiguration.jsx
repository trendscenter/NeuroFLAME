import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_COMPUTATIONS_LIST = gql`
    query getComputationsList {
        getComputationsList {
            id
            title
            description
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

const GET_COMPUTATION_DETAILS = gql`
  query getComputationDetails($computationId: String!) {
    getComputationDetails(computationId: $computationId) {
      id
      title
      description
      compSpec
    }
  }
`;

const SAVE_COMPUTATION_CONFIGURATION = gql`
    mutation saveComputationConfiguration($consortiumId: String!, $compSpec: String!, $adminFormData: String!) {
        saveComputationConfiguration(consortiumId: $consortiumId, compSpec: $compSpec, adminFormData: $adminFormData) {
            compSpec
            adminFormData
        }
    }
`;

export function useAdminComputationConfiguration({ consortiumId }) {
    const [loadedConfiguration, setLoadedConfiguration] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formSpec, setFormSpec] = useState(null);
    const [formData, setFormData] = useState(null);
    const [compSpec, setCompSpec] = useState(null);
    const [computationsList, setComputationsList] = useState([]);

    const [getComputationConfiguration] = useLazyQuery(GET_COMPUTATION_CONFIGURATION)
    const [getComputationDetails] = useLazyQuery(GET_COMPUTATION_DETAILS)
    const [saveComputationConfiguration] = useMutation(SAVE_COMPUTATION_CONFIGURATION)
    const [getComputationList] = useLazyQuery(GET_COMPUTATIONS_LIST)


    const initializeFormData = (formSpec) => {
        const defaultValues = {
            number: 0,
            string: "",
            boolean: false,
            csv: []
        };

        const myFormData = {};

        for (const fieldName of Object.keys(formSpec)) {
            const field = formSpec[fieldName]
            if (field.type === 'csv') {
                myFormData[fieldName] = []
            }
            else {
                myFormData[fieldName] = field.default || defaultValues[field.type]
            }
        }
        return myFormData;
    }

    const loadComputationConfiguration = () => {
        //get it
        getComputationConfiguration({
            variables: { consortiumId: consortiumId }, onCompleted: (data) => {
                // parse it
                const myCompSpec = JSON.parse(data.getComputationConfiguration.compSpec)
                const myFormSpec = myCompSpec.formSpec
                const myFormData = JSON.parse(data.getComputationConfiguration.adminFormData)
                // save it
                setLoadedConfiguration({ compSpec: myCompSpec, formSpec: myFormSpec, formData: myFormData })
                // apply it
                applyConfiguration(myCompSpec, myFormSpec, myFormData);
            }
        })
    }

    const loadComputationsList = () => {
        getComputationList({
            variables: { consortiumId: consortiumId }, onCompleted: (data) => {
                setComputationsList(data.getComputationsList)
            }
        })
    }

    useEffect(() => {
        loadComputationConfiguration()
        loadComputationsList()
    }, [consortiumId])


    const applyConfiguration = (compSpec, formSpec, formData) => {
        setCompSpec(compSpec);
        setFormSpec(formSpec);
        setFormData(formData || initializeFormData(formSpec));
    }

    const startEditing = () => {
        setEditMode(true);
    }

    const cancelEditing = () => {
        const { compSpec, formSpec, formData } = loadedConfiguration;
        applyConfiguration(compSpec, formSpec, formData);
        setEditMode(false);
    }

    const saveEdits = () => {
        saveComputationConfiguration({
            variables: {
                consortiumId: consortiumId,
                compSpec: JSON.stringify(compSpec),
                adminFormData: JSON.stringify(formData)
            },
            onCompleted: (data) => {
                setEditMode(false);
            }
        })
    }

    // TODO: make this just use fieldname and value and let the component decide what to do with it like in the member version
    const setField = ({ fieldName, index, value }) => {
        if (formSpec[fieldName].type === 'csv') {
            const newFormData = { ...formData }
            newFormData[fieldName][index] = value
            setFormData(newFormData)
        }
        else {
            const newFormData = { ...formData }
            newFormData[fieldName] = value
            setFormData(newFormData)
        }
    }

    const selectComputation = (computationId) => {
        //get it
        getComputationDetails({
            variables: { computationId: computationId }, onCompleted: (data) => {
                //parse it
                const myCompSpec = JSON.parse(data.getComputationDetails.compSpec)
                const myFormSpec = myCompSpec.formSpec
                const myFormData = null;
                //apply it
                applyConfiguration(myCompSpec, myFormSpec, myFormData);
            }
        })
    }

    return {
        startEditing,
        cancelEditing,
        saveEdits,
        editMode,
        computationsList,
        selectComputation,
        setField,
        compSpec,
        formData,
        formSpec
    }
}
