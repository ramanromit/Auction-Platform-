import { createContext, useState, useContext } from 'react';

const AuctionContext = createContext();

export const useAuction = () => {
    const context = useContext(AuctionContext);
    if (!context) {
        throw new Error('useAuction must be used within an AuctionProvider');
    }
    return context;
};

export const AuctionProvider = ({ children }) => {
    const [items, setItems] = useState([
        { id: 1, title: "Luxury Watch", bid: 45000, img: "/src/assets/images/image1.png", bids: [] },
        { id: 2, title: "Premium Sneakers", bid: 12500, img: "/src/assets/images/image2.png", bids: [] },
        { id: 3, title: "Electric Guitar", bid: 30000, img: "/src/assets/images/image3.png", bids: [] },
        { id: 4, title: "Sony Headphones", bid: 15000, img: "/src/assets/images/image1.png", bids: [] },
        { id: 5, title: "Gaming Console", bid: 35000, img: "/src/assets/images/image2.png", bids: [] },
        { id: 6, title: "VR Headset", bid: 28000, img: "/src/assets/images/image3.png", bids: [] }
    ]);

    const addItem = (item) => {
        setItems((prevItems) => [item, ...prevItems]);
    };

    const placeBid = (itemId, bidAmount) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        bid: bidAmount,
                        bids: [...item.bids, { amount: bidAmount, time: new Date().toLocaleTimeString() }]
                    }
                    : item
            )
        );
    };

    return (
        <AuctionContext.Provider value={{ items, addItem, placeBid }}>
            {children}
        </AuctionContext.Provider>
    );
};
