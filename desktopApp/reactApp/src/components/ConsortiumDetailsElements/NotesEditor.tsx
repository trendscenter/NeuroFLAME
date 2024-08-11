import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from  '@mui/icons-material/Save';
import parse from 'html-react-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NotesEditor({
    editorCustomStyles,
    editorHandleSetNotes,
    editorEditMode,
    editorSetEditMode,
    editorEditableNotes,
    editorSetEditableNotes,
    editorUserIsLeader
}) {

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{'list': 'bullet'}],
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
    ];

    return (
        <div style={editorCustomStyles.container}>
            <div style={editorCustomStyles.labelBetween}>
                <h3 style={editorCustomStyles.h3}>Leader Notes</h3>
                {editorUserIsLeader && <div>
                    {editorEditMode ? 
                    <div>
                    <SaveIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={editorHandleSetNotes} />
                    <CancelIcon style={{ color: 'lightpink' }} onClick={() => {editorSetEditMode(!editorEditMode)}} />
                    </div> : 
                    <EditIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => {editorSetEditMode(!editorEditMode)}} />}
                </div>}
            </div>
            {editorEditMode ? <ReactQuill theme="snow" value={editorEditableNotes} onChange={editorSetEditableNotes} modules={modules} formats={formats}></ReactQuill> : <div>{parse(editorEditableNotes)}</div>}
        </div>
    )
}