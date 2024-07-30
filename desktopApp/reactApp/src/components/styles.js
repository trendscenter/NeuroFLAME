// styles.js
const styles = {
    container: {
        display: 'flex'
    },
    navbar: {
        flex: '0 0 200px',
        padding: '20px',
        borderRight: '1px solid #ddd',
    },
    content: {
        flex: '1',
        padding: '20px',
        marginTop: '4rem',
    },
    simpleBorder: {
        border: '1px solid #ccc',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '5px',
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)'
    },
    card: {
        marginBottom: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left'
    },
    cardRow: {
        marginBottom: '1rem',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
};

export default styles;
