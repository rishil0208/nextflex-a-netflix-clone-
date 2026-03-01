export default function Logo({ className = "" }: { className?: string }) {
    return (
        <div
            className={`logo-n ${className}`}
            style={{
                position: 'relative',
                width: '24px',
                height: '32px',
                background: '#ec1337',
                clipPath: 'polygon(0 0, 35% 0, 35% 70%, 65% 0, 100% 0, 100% 100%, 65% 100%, 65% 30%, 35% 100%, 0 100%)',
                transform: 'rotate(180deg)',
                boxShadow: '0 0 15px rgba(236, 19, 55, 0.5)'
            }}
        />
    );
}
