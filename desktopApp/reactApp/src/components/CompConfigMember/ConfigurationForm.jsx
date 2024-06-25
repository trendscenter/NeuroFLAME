import React, { useState } from 'react';
import styles from "../styles.js"
import { gql } from '@apollo/client';
//import { useApolloClientsContext } from '../ApolloClientsContext.js';

// Define custom styles
const customStyles = {
    simpleBorder: {
        border: '1px solid #ccc',
        padding: '10px',
    },
    buttonMargin: {
        margin: '10px',
    },
    filePathSection: {
        borderRadius: '5px',
        border: '1px solid #ccc',
        margin: '10px',
        padding: '5px',
    },
    columnList: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '5px',
        margin: '10px',
    },
    columnMap: {
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        margin: '10px',
    },
    rowStyle: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px',
    },
};

const GET_CSV_COLUMNS = gql`
    query getCSVColumns($filePath: String!) {
        getCSVColumns(filePath: $filePath)
    }
`;

export function ConfigurationForm({ setField, formSpec, memberFormData, compSpec, editing, startEditing, cancelEditing, saveEdits }) {
    return (
        <div style={styles.simpleBorder}>
            <h1>{compSpec.title}</h1>
            <div>
                {
                    memberFormData && Object.keys(memberFormData).map((fieldName) => {
                        const fieldType = formSpec[fieldName]?.type;

                        if (fieldType === 'csv') {
                            return (
                                <FieldTypeCSV
                                    key={fieldName}
                                    fieldName={fieldName}
                                    memberFormData={memberFormData}
                                    setField={setField}
                                    editing={editing}
                                />
                            );
                        }

                        return <div key={fieldName}>Unknown field type: {fieldName}</div>
                    })
                }
            </div>
            <div>
                {!editing && <button style={customStyles.buttonMargin} onClick={startEditing}>Edit</button>}
                {editing && <button style={customStyles.buttonMargin} onClick={cancelEditing}>Cancel</button>}
                {editing && <button style={customStyles.buttonMargin} onClick={saveEdits}>Save</button>}
            </div>
            <div style={styles.simpleBorder}>
                <Collapse content={
                    <div>
                        <code>
                            <pre>
                                {JSON.stringify(memberFormData, null, 2)}
                            </pre>
                        </code>
                    </div>
                }>
                </Collapse>
            </div>
        </div>
    );
}


function FieldTypeCSV({ fieldName, memberFormData, setField, editing }) {
    const adminColumnNames = Object.keys(memberFormData[fieldName].columns);
    const [CSVColumnNames, setCSVColumnNames] = useState([]);

    const updateField = (value) => {
        setField({ fieldName, value: { ...memberFormData[fieldName], ...value } });
    };

    const handleFileSelect = (e) => {
        const path = e.target.files.length === 0 ? "" : e.target.files[0].path;
        updateField({ path });
        e.target.value = null;
    };

    const handlePathChange = (e) => {
        const path = e.target.value
        updateField({ path: e.target.value });
    };

    return (
        <div>
            <h3>{fieldName}</h3>
            <small>csv</small>
            <FilePathSection
                handleFileSelect={handleFileSelect}
                handlePathChange={handlePathChange}
                path={memberFormData[fieldName].path}
                setCSVColumnNames={setCSVColumnNames}
                editing={editing}
            />

            <ColumnList title="Admin Defined Columns" columns={adminColumnNames} />
            <ColumnList title="Columns from .csv" columns={CSVColumnNames} />
            <h4>Map</h4>
            <ColumnMap
                editing={editing}
                setColumnMap={(columnMap) => updateField({ columns: columnMap })}
                memberMapping={memberFormData[fieldName].columns}
                sourceColumnNames={CSVColumnNames}
            />
        </div>
    );
}

function FilePathSection({ handleFileSelect, handlePathChange, path, setCSVColumnNames, editing }) {
    //const { federatedClientClient } = useApolloClientsContext();

    const fetchCSVColumns = async (filePath) => {
        const { data } = await federatedClientClient.query({
            query: GET_CSV_COLUMNS,
            variables: { filePath }
        });
        return data.getCSVColumns;
    };

    return (
        <div style={customStyles.filePathSection}>
            .csv file path
            <div style={{ display: !editing ? "none" : "block" }}>
                <label htmlFor='file-select' className='button'>
                    Choose File
                </label>
                <input disabled={!editing} type="file" style={{visibility: "hidden"}} onChange={handleFileSelect} id={"file-select"} />
            </div>
            <div>
                <input disabled={!editing} type="text" value={path} onChange={handlePathChange} />
            </div>
            {path && editing && <button onClick={async () => {
                const result = await fetchCSVColumns(path);
                setCSVColumnNames(result)
            }
            }>Get CSV columns</button>}
        </div>
    );
}

function ColumnList({ title, columns }) {
    return (
        <div style={customStyles.columnList}>
            <h4>{title}</h4>
            <div>
                {columns.map((columnName) => (
                    <div key={columnName}>{columnName}</div>
                ))}
            </div>
        </div>
    );
}

function ColumnMap({ setColumnMap, memberMapping, sourceColumnNames, editing }) {
    const targetColumnNames = Object.keys(memberMapping)
    const autoMapColumns = () => {
        const newColumnMap = { ...memberMapping }
        targetColumnNames.forEach(targetColumnName => {
            sourceColumnNames.forEach(sourceColumnName => {
                const namesMatch = sourceColumnName.toLowerCase() === targetColumnName.toLowerCase()
                if (namesMatch) {
                    newColumnMap[targetColumnName] = sourceColumnName
                }
            })
        })
        setColumnMap(newColumnMap)
    }

    return (
        <div style={customStyles.columnMap}>
            {targetColumnNames.map((targetColumnName) => {
                return <ColumnMapRow
                    editing={editing}
                    key={targetColumnName}
                    targetColumnName={targetColumnName}
                    sourceColumnNames={sourceColumnNames}
                    memberMapping={memberMapping}
                    setColumnMap={setColumnMap}
                />
            })}
            <div>
                {editing && <button onClick={autoMapColumns}>auto map</button>}
            </div>
        </div>
    )
}

function ColumnMapRow({ targetColumnName, sourceColumnNames, memberMapping, setColumnMap, editing }) {
    const shouldShowAdditionalOption = memberMapping[targetColumnName]
        && !sourceColumnNames.includes(memberMapping[targetColumnName]);

    return (
        <div style={customStyles.rowStyle}>
            <label>{targetColumnName}:</label>
            <select
                disabled={!editing}
                value={memberMapping[targetColumnName]}
                onChange={e => setColumnMap({ ...memberMapping, [targetColumnName]: e.target.value })}
            >
                <option value="">none</option>
                {sourceColumnNames.map((sourceColumnName) => (
                    <option key={sourceColumnName} value={sourceColumnName}>
                        {sourceColumnName}
                    </option>
                ))}
                {
                    shouldShowAdditionalOption && <option value={memberMapping[targetColumnName]}>{memberMapping[targetColumnName]}</option>
                }
            </select>
        </div>)
}

function Collapse({ content }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div>
            <button onClick={() => { setCollapsed(!collapsed) }}>View JSON</button>
            {!collapsed && content}
        </div>
    )
}