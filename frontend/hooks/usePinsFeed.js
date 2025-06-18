import { useEffect, useState } from 'react';
import { pinsAPI } from '../services/api';

export const usePinsFeed = (navigation) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPins = async () => {
        try {
            setLoading(true);
            const response = await pinsAPI.getAllPins();
            setPins(response);
            setError(null);
        } catch (err) {
            console.error('Error fetching pins:', err);
            setError('Failed to load pins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPins();
        const unsubscribe = navigation.addListener('refreshHome', fetchPins);
        return unsubscribe;
    }, [navigation]);

    return { pins, loading, error, refetch: fetchPins };
};
