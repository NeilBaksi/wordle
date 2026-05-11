import { useToast } from '../context/ToastContext';

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'absolute',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        zIndex: 60,
        pointerEvents: 'none',
        width: 'max-content',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-enter"
          role="status"
          style={{
            backgroundColor: 'var(--color-text)',
            color: 'var(--color-bg)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '10px 16px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
