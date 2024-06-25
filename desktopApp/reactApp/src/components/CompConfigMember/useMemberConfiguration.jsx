import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useApolloClientsContext } from "../ApolloClientsContext";

const GET_COMPUTATION_CONFIGURATION = gql`
    query getComputationConfiguration($consortiumId: String!) {
        getComputationConfiguration(consortiumId: $consortiumId) {
            compSpec
            adminFormData
        }
    }   
`;

const GET_MEMBER_FORM_DATA = gql`
    query getMemberFormData($consortiumId: String!) {
        getMemberFormData(consortiumId: $consortiumId)
    }
`

const SAVE_MEMBER_FORM_DATA = gql`
    mutation saveMemberFormData($consortiumId: String!, $formData: String!) {
        saveMemberFormData(consortiumId: $consortiumId, formData: $formData)
    }
`

//load the compspec and adminFormData
//use the compspec and adminFormData to generate a formSpec
//load memberFormData or
//create default memberFormData from the formSpec


export function useMemberComputationConfiguration({ consortiumId }) {
    const [loadedConfiguration, setLoadedConfiguration] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [adminFormData, setAdminFormData] = useState(null);
    const [formSpec, setFormSpec] = useState(null);
    const [memberFormData, setMemberFormData] = useState(null);
    const [compSpec, setCompSpec] = useState(null);
    const {centralServerClient, federatedClientClient} = useApolloClientsContext();

    const initializeFormData = (formSpec, adminFormData) => {
        const myFormData = {};

        for (const fieldName of Object.keys(formSpec)) {
            const field = formSpec[fieldName]
            if (field.type === 'csv') {
                myFormData[fieldName] = {
                    path: "",
                    columns: {}
                }
                adminFormData[fieldName].forEach((value, index) => {
                    myFormData[fieldName].columns[value.name] = ""
                })
            }
        }
        return myFormData;
    }

    const combineExistingFormData = (formSpec, adminFormData, memberFormData) => {
        const myFormData = {};

        for (const fieldName of Object.keys(formSpec)) {
            const field = formSpec[fieldName]
            if (field.type === 'csv') {
                myFormData[fieldName] = {
                    path: memberFormData[fieldName].path,
                    columns: {}
                }
                adminFormData[fieldName].forEach((value, index) => {
                    try {
                        myFormData[fieldName].columns[value.name] = memberFormData[fieldName].columns[value.name] || ""
                    } catch {
                        console.error("columns not found")
                    }
                })
            }
        }
        return myFormData;
    }

    const fetchData = async (client, query, variables) => {
        try {
            const { data } = await client.query({ query, variables });
            return data;
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
            return null;
        }
    };

    const loadComputationConfiguration = async () => {

        const { getComputationConfiguration } = await fetchData(
            centralServerClient,
            GET_COMPUTATION_CONFIGURATION,
            { consortiumId }
        );

        const myCompSpec = JSON.parse(getComputationConfiguration.compSpec);
        const myFormSpec = myCompSpec.formSpec;
        const myAdminFormData = JSON.parse(getComputationConfiguration.adminFormData);

        let { getMemberFormData } = await fetchData(
            federatedClientClient,
            GET_MEMBER_FORM_DATA,
            { consortiumId }
        );
        let myMemberFormData = JSON.parse(getMemberFormData);

        if (myMemberFormData) {
            myMemberFormData = combineExistingFormData(myFormSpec, myAdminFormData, myMemberFormData);
        } else {
            myMemberFormData = initializeFormData(myFormSpec, myAdminFormData);
        }

        const loadedConfiguration = {
            compSpec: myCompSpec,
            formSpec: myFormSpec,
            adminFormData: myAdminFormData,
            memberFormData: myMemberFormData,
        };

        setLoadedConfiguration(loadedConfiguration);
        applyConfiguration(myCompSpec, myFormSpec, myAdminFormData, myMemberFormData);
    };



    useEffect(() => {
        loadComputationConfiguration()
    }, [consortiumId])

    const applyConfiguration = (compSpec, formSpec, adminFormData, memberFormData) => {
        setCompSpec(compSpec);
        setFormSpec(formSpec);
        setAdminFormData(adminFormData)
        setMemberFormData(memberFormData || initializeFormData(formSpec, adminFormData));
    }

    const startEditing = () => {
        setEditMode(true);
    }

    const cancelEditing = () => {
        const { compSpec, formSpec, adminFormData, memberFormData } = loadedConfiguration;
        applyConfiguration(compSpec, formSpec, adminFormData, memberFormData);
        setEditMode(false);
    }

    const saveEdits = async () => {
        await fetchData(
            federatedClientClient,
            SAVE_MEMBER_FORM_DATA,
            { consortiumId, formData: JSON.stringify(memberFormData) }
        );
        setEditMode(false);
    }

    const setField = ({ fieldName, value }) => {
        const newFormData = { ...memberFormData }
        newFormData[fieldName] = value
        setMemberFormData(newFormData)
    }

    return {
        startEditing,
        cancelEditing,
        saveEdits,
        editMode,
        setField,
        compSpec,
        formSpec,
        adminFormData,
        memberFormData,
    }
}
