import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/navbar';
import DarkVeil from '../components/DarkVeil';
import Stepper, { Step } from '../components/Stepper';

export default function SellItem() {
    const { addItem } = useAuction();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        condition: 'Like New',
        startingBid: '',
        image: null,
        imagePreview: null
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, image: file, imagePreview: preview }));
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.image) newErrors.image = "Product image is required";
        if (!formData.startingBid.trim()) newErrors.startingBid = "Starting bid is required";
        if (parseInt(formData.startingBid) <= 0) newErrors.startingBid = "Bid must be greater than 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStepChange = (step) => {
        if (step > 1) {
            // Moving to next step, validate current step
            if (step === 2 && !validateStep1()) return;
            if (step === 3 && !validateStep2()) return;
        }
        setErrors({});
    };

    const handleSubmit = () => {
        if (validateStep2()) {
            const newItem = {
                title: formData.title,
                bid: `₹${formData.startingBid}`,
                img: formData.imagePreview,
                description: formData.description,
                category: formData.category,
                condition: formData.condition
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
                        className="w-full max-w-4xl bg-[#111827]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800/50 shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-red-500 text-center">Sell Your Item</h2>

                        <Stepper
                            initialStep={1}
                            onStepChange={handleStepChange}
                            backButtonText="Previous"
                            nextButtonText="Next"
                            onFinalStepCompleted={handleSubmit}
                        >
                            {/* STEP 1: Item Details */}
                            <Step>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">Step 1: Item Details</h3>
                                    
                                    <div>
                                        <label className="block text-gray-400 mb-2">Item Title *</label>
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                            >
                                                <option>Electronics</option>
                                                <option>Collectibles</option>
                                                <option>Fashion</option>
                                                <option>Home & Garden</option>
                                                <option>Sports</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 mb-2">Condition</label>
                                            <select
                                                name="condition"
                                                value={formData.condition}
                                                onChange={handleChange}
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                            >
                                                <option>Like New</option>
                                                <option>Excellent</option>
                                                <option>Good</option>
                                                <option>Fair</option>
                                                <option>Poor</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition resize-none"
                                            placeholder="Describe your item condition, history, features, etc..."
                                        ></textarea>
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                </div>
                            </Step>

                            {/* STEP 2: Image & Pricing */}
                            <Step>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">Step 2: Image & Pricing</h3>
                                    
                                    <div>
                                        <label className="block text-gray-400 mb-3">Product Image *</label>
                                        <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center relative overflow-hidden bg-gray-900/50 hover:border-red-500/50 transition cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />

                                            {formData.imagePreview ? (
                                                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <div className="text-4xl mb-2">📷</div>
                                                    <p className="text-gray-400 group-hover:text-white transition">Click to upload product image</p>
                                                </div>
                                            )}
                                        </div>
                                        {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Starting Bid (₹) *</label>
                                        <input
                                            type="number"
                                            name="startingBid"
                                            value={formData.startingBid}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
                                            placeholder="e.g. 5000"
                                            min="1"
                                        />
                                        {errors.startingBid && <p className="text-red-500 text-sm mt-1">{errors.startingBid}</p>}
                                    </div>
                                </div>
                            </Step>

                            {/* STEP 3: Preview & Confirm */}
                            <Step>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-6">Step 3: Review & Submit</h3>
                                    
                                    <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-6">
                                        {/* Image Preview */}
                                        <div className="mb-6">
                                            {formData.imagePreview && (
                                                <img src={formData.imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Item Title</p>
                                                <p className="text-white font-semibold text-xl">{formData.title}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Category</p>
                                                    <p className="text-white font-semibold">{formData.category}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Condition</p>
                                                    <p className="text-white font-semibold">{formData.condition}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-sm">Description</p>
                                                <p className="text-gray-300 text-sm mt-1">{formData.description}</p>
                                            </div>

                                            <div className="border-t border-gray-700 pt-4">
                                                <p className="text-gray-400 text-sm">Starting Bid</p>
                                                <p className="text-red-500 font-bold text-2xl">₹{formData.startingBid}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm text-center">Click "Submit" to list your item for auction</p>
                                </div>
                            </Step>
                        </Stepper>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
