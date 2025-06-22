import toast from 'react-hot-toast';

// Toast helpers
export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => {
        // Handle array messages - show each in separate stacked card
        if (Array.isArray(message)) {
            // Show multiple toast notifications for each error with stacking
            message.forEach((msg, index) => {
                setTimeout(() => {
                    toast.error(msg, {
                        id: `error-${Date.now()}-${index}`, // Unique ID for each toast
                        duration: 6000,
                        position: 'top-right',
                        style: {
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            fontWeight: '500',
                            maxWidth: '400px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        },
                        // Custom icon for error
                        icon: '❌',
                    });
                }, index * 150); // Reduced stagger time for better stacking effect
            });
            return;
        }
        return toast.error(message, {
            style: {
                whiteSpace: 'pre-line' // Allow line breaks
            }
        });
    },
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
};

export default showToast; 