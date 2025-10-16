import React, { useState, useEffect } from 'react';
import api from '../utils/axios'
const UpdatePaymentStatus = () => {
    const [utr, setUtr] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('success');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [allPayments, setAllPayments] = useState([]);
    const [me, setMe] = useState(null);
    const handleUtrChange = (e) => {
        setUtr(e.target.value);
    };
    const handleStatusChange = (e) => {
        setPaymentStatus(e.target.value);
    };
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!utr) {
        setMessage('Please enter a valid UTR.');
        setIsLoading(false);
        return;
    }

    try {
        // Prepare the payload with the updated payment status
        const payload = {
            paymentstatus: paymentStatus,  // Change to paymentstatus
        };

        // Make the PUT request using axios
        const response = await api.put(`/payment/status/${utr}`, payload, {
            headers: {
                'Content-Type': 'application/json',  // Ensure Content-Type is set to JSON
            },
        });

        // Check the response and set messages accordingly
        if (response.status === 200) {
            setMessage(`Payment status updated to ${paymentStatus}.`);
        } else {
            setMessage(`Error: ${response.data.message}`);
        }
    } catch (error) {
        setMessage(`An error occurred: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
};


    // Fetch all payments when the component mounts
    useEffect(() => {
        const fetchAllPayments = async () => {
            try {
                const response = await api.get('/payment/all-payments'); // Make the API call
                // console.log("Fetched data:", response.data);  // Log the data to check if it's correct

                if (response.data && response.data.payments) {
                    setAllPayments(response.data.payments); // Set the payments data into state
                } else {
                    setMessage('Failed to fetch payments');
                }
            } catch (error) {
                setMessage(`An error occurred: ${error.message}`);
            }
        };
        fetchAllPayments();
    }, []);
    return (
        <div style={styles.container}>
            <h1>Update Payment Status</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="utr">Enter UTR:</label>
                    <input
                        type="text"
                        id="utr"
                        value={utr}
                        onChange={handleUtrChange}
                        placeholder="Enter UTR"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="paymentstatus">Select Payment Status:</label>
                    <select
                        id="paymentstatus"
                        value={paymentStatus}
                        onChange={handleStatusChange}
                        required
                        style={styles.select}
                    >
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Status'}
                </button>
            </form>

            {message && (
                <div style={styles.message}>
                    <p style={message.includes('Error') ? styles.error : styles.success}>{message}</p>
                </div>
            )}

            {/* Display all payments */}
            <h2>All Payments</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>UTR</th>
                        <th>User Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {allPayments.length > 0 ? (
                        allPayments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.utr}</td>
                                <td>{payment.user_id?.name}</td> {/* Accessing the user name */}
                                <td>{payment.paymentstatus}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No payments available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Inline styles for simplicity
const styles = {
    container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
    },
    select: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
    },
    message: {
        textAlign: 'center',
        marginTop: '20px',
    },
    success: {
        color: 'green',
    },
    error: {
        color: 'red',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    th: {
        padding: '10px',
        backgroundColor: '#f4f4f4',
        border: '1px solid #ccc',
    },
    td: {
        padding: '10px',
        border: '1px solid #ccc',
    },
};

export default UpdatePaymentStatus;
