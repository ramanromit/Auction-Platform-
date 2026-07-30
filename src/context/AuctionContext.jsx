import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
    : `http://${window.location.hostname}:5000`;
const API_URL = `${BASE_URL}/api/auctions`;
const AuctionContext = createContext();

export const useAuction = () => {
    const context = useContext(AuctionContext);
    if (!context) {
        throw new Error('useAuction must be used within an AuctionProvider');
    }
    return context;
};

// Helper to get auth config
const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
    }
    return { headers: { 'Content-Type': 'application/json' } };
};

export const AuctionProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [myItems, setMyItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [myItemsLoading, setMyItemsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all active auction items (excludes user's own if logged in)
    const fetchItems = useCallback(async () => {
        try {
            setItemsLoading(true);
            setError(null);
            const config = getAuthConfig();
            const { data } = await axios.get(API_URL, config);
            setItems(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch auctions');
            console.error('fetchItems error:', err.message);
        } finally {
            setItemsLoading(false);
        }
    }, []);

    // Fetch current user's auction items
    const fetchMyItems = useCallback(async () => {
        try {
            setMyItemsLoading(true);
            setError(null);
            const config = getAuthConfig();
            const { data } = await axios.get(`${API_URL}/mine`, config);
            setMyItems(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch your items');
            console.error('fetchMyItems error:', err.message);
        } finally {
            setMyItemsLoading(false);
        }
    }, []);

    // Fetch single item by ID
    const fetchItemById = useCallback(async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}`);
            return data;
        } catch (err) {
            console.error('fetchItemById error:', err.message);
            return null;
        }
    }, []);

    // Create a new auction item
    const addItem = useCallback(async (itemData) => {
        try {
            setMyItemsLoading(true);
            setError(null);
            const config = getAuthConfig();
            const { data } = await axios.post(API_URL, itemData, config);
            // Add to myItems (seller's own listings), NOT live auctions items
            setMyItems((prev) => [data, ...prev]);
            return data;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create auction item';
            setError(message);
            throw new Error(message);
        } finally {
            setMyItemsLoading(false);
        }
    }, []);

    // Delete an auction item
    const deleteItem = useCallback(async (id) => {
        try {
            setError(null);
            const config = getAuthConfig();
            await axios.delete(`${API_URL}/${id}`, config);
            
            setMyItems((prev) => prev.filter(item => item._id !== id));
            setItems((prev) => prev.filter(item => item._id !== id));
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete auction item';
            setError(message);
            throw new Error(message);
        }
    }, []);

    // Reset all state (call on logout)
    const resetState = useCallback(() => {
        setItems([]);
        setMyItems([]);
        setError(null);
    }, []);

    return (
        <AuctionContext.Provider value={{
            items,
            myItems,
            itemsLoading,
            myItemsLoading,
            error,
            fetchItems,
            fetchMyItems,
            fetchItemById,
            addItem,
            deleteItem,
            resetState,
        }}>
            {children}
        </AuctionContext.Provider>
    );
};
