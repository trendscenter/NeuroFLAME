import { Box, Button } from "@mui/material";
import { useState } from "react";
import {  
    MDXEditor, BoldItalicUnderlineToggles, ListsToggle, headingsPlugin, quotePlugin, listsPlugin, toolbarPlugin, diffSourcePlugin, DiffSourceToggleWrapper, markdownShortcutPlugin, 
    linkPlugin} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

interface ConsortiumLeaderNotesEditProps {
    consortiumLeaderNotes: string;
    onSave: (newNotes: string) => void;
    onCancel: () => void;
}

export default function ConsortiumLeaderNotesEdit({
    consortiumLeaderNotes,
    onSave,
    onCancel,
}: ConsortiumLeaderNotesEditProps) {
    const [notes, setNotes] = useState(consortiumLeaderNotes);

    const handleSave = () => {
        onSave(notes);
    };

    return (
        <Box>
            <MDXEditor
                markdown={notes}
                onChange={(e) => setNotes(e)}
                plugins={[
                    headingsPlugin(),
                    quotePlugin(),
                    linkPlugin(),
                    listsPlugin(),
                    toolbarPlugin({
                    toolbarClassName: 'my-classname',
                    toolbarContents: () => (
                        <>
                        {' '}
                        <DiffSourceToggleWrapper options={['rich-text','source']} >
                        <BoldItalicUnderlineToggles />
                        <ListsToggle />
                        </DiffSourceToggleWrapper>
                        </>
                    )
                    }),
                    diffSourcePlugin({ diffMarkdown: notes, viewMode: 'rich-text' }),
                    markdownShortcutPlugin(),
                ]}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
