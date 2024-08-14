// styles.js
const styles = {
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
    },
    labelBetween: {
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    h3 : {
        marginBottom: '0.5rem'
    },
    rowStyleTwoCols: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridColumn: 'auto',
        gap: '2rem',
        alignItems: 'top',
        gridAutoRows: 'auto',
        marginBottom: '10px',
    },
    rowStyleThreeCols: {
        display: 'grid',
        gridTemplateColumns: '3fr 3fr 3fr',
        gridColumn: '1',
        gap: '2rem',
        gridAutoRows: 'auto',
        marginBottom: '10px',
    },
    rowStyleHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridColumn: '1',
        gap: '2rem',
        alignItems: 'center',
        gridAutoRows: 'auto',
        marginBottom: '2rem'
    },
    container: {
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1rem',
    },
        containerSelfHeight: {
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '1rem',
        height: 'fit-content',
    },
    buttonSmall: {
        fontSize: '14px',
        padding: '10px 14px',
        marginLeft: '1rem'
    },
    containerOverflow: {
        height: 'auto',
        maxHeight: '340px',
        overflow: 'scroll'
    }
};

export default styles;
