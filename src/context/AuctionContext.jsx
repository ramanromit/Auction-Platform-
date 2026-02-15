import { createContext, useState, useContext } from 'react';

const AuctionContext = createContext();

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
    const [items, setItems] = useState([
        { title: "Luxury Watch", bid: "₹45,000", img: "/src/assets/images/image1.png" },
        { title: "Premium Sneakers", bid: "₹12,500", img: "/src/assets/images/image2.png" },
        { title: "Electric Guitar", bid: "₹30,000", img: "/src/assets/images/image3.png" },
        { title: "Sony Headphones", bid: "₹15,000", img: "/src/assets/images/image1.png" },
        { title: "Gaming Console", bid: "₹35,000", img: "/src/assets/images/image2.png" },
        { title: "VR Headset", bid: "₹28,000", img: "/src/assets/images/image3.png" }
    ]);

    const addItem = (item) => {
        setItems((prevItems) => [item, ...prevItems]);
    };

    return (
        <AuctionContext.Provider value={{ items, addItem }}>
            {children}
        </AuctionContext.Provider>
    );
};
