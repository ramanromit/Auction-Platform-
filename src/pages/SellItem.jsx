import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/navbar';
import DarkVeil from '../components/DarkVeil';

export default function SellItem() {
    const { addItem } = useAuction();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        bid: '',
        description: '',
        image: null
    });

    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.bid.trim()) newErrors.bid = "Starting bid is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.image) newErrors.image = "Product image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Create new item object
            // In a real app, you'd upload the image to a server/storage here
            const newItem = {
                title: formData.title,
                bid: `₹${formData.bid}`, // Formatting currency
                img: preview, // Using the local preview URL for demo purposes
                description: formData.description
            };

            addItem(newItem);
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
            {/* Fixed DarkVeil Background */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <DarkVeil
                        hueShift={-110}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={0.7}
                    />
                </div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="pt-28 pb-10 flex justify-center items-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl bg-[#111827]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800/50 shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-red-500 text-center">Sell Your Item</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Image Upload */}
                            <div className="flex flex-col items-center">
                                <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-900/50 hover:border-red-500/50 transition cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="text-4xl mb-2">📷</div>
                                            <p className="text-gray-400 group-hover:text-white transition">Click to upload product image</p>
                                        </div>
                                    )}
                                </div>
                                {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Item Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                        placeholder="e.g. Vintage Camera"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-400 mb-2">Starting Bid (₹)</label>
                                    <input
                                        type="number"
                                        name="bid"
                                        value={formData.bid}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                        placeholder="e.g. 5000"
                                    />
                                    {errors.bid && <p className="text-red-500 text-sm mt-1">{errors.bid}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                    placeholder="Describe your item condition, history, etc..."
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="w-1/2 border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold shadow-lg shadow-red-600/20 transition"
                                >
                                    List Item
                                </button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
