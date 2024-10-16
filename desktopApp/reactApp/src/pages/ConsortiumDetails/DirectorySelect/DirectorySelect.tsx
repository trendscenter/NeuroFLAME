import { useDirectorySelect } from './useDirectorySelect';
import { DirectorySelectDisplay } from './DirectorySelectDisplay';

export default function DirectorySelect() {
    const {
        editableValue, 
        changeValue, 
        saveEditedValue, 
        startEdit, 
        cancelEdit, 
        isEditing, 
        isDifferent, 
<<<<<<< HEAD
        openDirectoryDialogHandler,

=======
        openDirectoryDialogHandler
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    } = useDirectorySelect();

    return (
        <DirectorySelectDisplay
            directory={editableValue}
            isEditing={isEditing}
            isDifferent={isDifferent}
            onDirectoryChange={changeValue}
            onOpenDirectoryDialog={openDirectoryDialogHandler}
            onSaveDirectory={saveEditedValue}
            onCancelEdit={cancelEdit}
            onStartEdit={startEdit}
        />
    );
}
