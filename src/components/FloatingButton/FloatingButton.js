export default function FloatingButton({ onClick, position, className, text }) {
    let placement = {};

    switch (position) {
        case 'top-right':
            placement = { top: '20px', right: '20px' };
            break;
        case 'top-left':
            placement = { top: '20px', left: '20px' };
            break;
        case 'bottom-right':
            placement = { bottom: '20px', right: '20px' };
            break;
        case 'bottom-left':
            placement = { bottom: '20px', left: '20px' };
            break;
        default:
            placement = { bottom: '20px', right: '20px' }; // default to bottom-right
    }

    return (
        <button
            className={className}
            style={{
                position: 'fixed',
                backgroundColor: "var(--accent)",
                padding: "15px",
                borderRadius: "15px",
                ...placement,
            }}
            onClick={onClick}
        >
            {text }
        </button>
    );
}
