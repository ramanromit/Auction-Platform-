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
        endDate: '',
        image: null,
        imagePreview: null,
        imageBase64: null,
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
                <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <DarkVeil hueShift={-110} noiseIntensity={0} scanlineIntensity={0} speed={0.7} />
                    </div>
                </div>
                <div className="relative z-10">
                    <Navbar />
                    <div className="pt-28 flex flex-col items-center justify-center px-4">
                        <div className="bg-[#111827]/80 backdrop-blur-md p-10 rounded-2xl border border-gray-800/50 shadow-2xl text-center max-w-md">
                            <h2 className="text-2xl font-bold text-red-500 mb-4">Login Required</h2>
                            <p className="text-gray-400 mb-6">You need to be logged in to sell items.</p>
                            <button
                                onClick={() => navigate('/auth')}
                                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: preview,
                    imageBase64: reader.result,
                }));
            };
            reader.readAsDataURL(file);

            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.title.trim())
            newErrors.title = "Product name is required";
        else if (formData.title.trim().length < 3)
            newErrors.title = "Product name must be at least 3 characters";

        if (!formData.description.trim())
            newErrors.description = "Description is required";
        else if (formData.description.trim().length < 10)
            newErrors.description = "Description must be at least 10 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.image)
            newErrors.image = "Product image is required";

        const bidValue = Number(formData.startingBid);
        if (!formData.startingBid.toString().trim())
            newErrors.startingBid = "Starting bid is required";
        else if (isNaN(bidValue) || bidValue <= 0)
            newErrors.startingBid = "Starting bid must be a positive number";
        else if (bidValue < 100)
            newErrors.startingBid = "Minimum starting bid is ₹100";

        if (!formData.endDate)
            newErrors.endDate = "Auction end date is required";
        else {
            const endDate = new Date(formData.endDate);
            const now = new Date();
            if (endDate <= now)
                newErrors.endDate = "End date must be in the future";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBeforeNext = (step) => {
        let valid = true;
        if (step === 1) valid = validateStep1();
        if (step === 2) valid = validateStep2();
        if (valid) setErrors({});
        return valid;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError('');

        try {
            const itemData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                condition: formData.condition,
                startingPrice: Number(formData.startingBid),
                image: formData.imageBase64,
                endTime: new Date(formData.endDate).toISOString(),
            };

            await addItem(itemData);
            navigate('/dashboard');
        } catch (err) {
            setSubmitError(err.message || 'Failed to list item. Please try again.');
            setSubmitting(false);
        }
    };

    // Get minimum date for the date picker (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().slice(0, 16);
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

                        {submitError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
                                {submitError}
                            </div>
                        )}

                        <Stepper
                            initialStep={1}
                            beforeNext={handleBeforeNext}
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
                                            className={`w-full bg-gray-900/50 border rounded-lg p-3 text-white focus:outline-none transition ${errors.title
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-700 focus:border-red-500'
                                                }`}
                                            placeholder="e.g. Vintage Camera"
                                        />
                                        {errors.title && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors.title}
                                            </p>
                                        )}
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
                                            className={`w-full bg-gray-900/50 border rounded-lg p-3 text-white focus:outline-none transition resize-none ${errors.description
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-700 focus:border-red-500'
                                                }`}
                                            placeholder="Describe your item condition, history, features, etc..."
                                        ></textarea>
                                        {errors.description && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors.description}
                                            </p>
                                        )}
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
                                        {errors.image && (
                                            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                <span>⚠</span> {errors.image}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Starting Bid (₹) *</label>
                                        <input
                                            type="number"
                                            name="startingBid"
                                            value={formData.startingBid}
                                            onChange={handleChange}
                                            className={`w-full bg-gray-900/50 border rounded-lg p-3 text-white focus:outline-none transition ${errors.startingBid
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-700 focus:border-red-500'
                                                }`}
                                            placeholder="e.g. 5000"
                                            min="1"
                                        />
                                        {errors.startingBid && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors.startingBid}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 mb-2">Auction End Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            min={getMinDate()}
                                            className={`w-full bg-gray-900/50 border rounded-lg p-3 text-white focus:outline-none transition ${errors.endDate
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-700 focus:border-red-500'
                                                }`}
                                        />
                                        {errors.endDate && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors.endDate}
                                            </p>
                                        )}
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

                                            <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Starting Bid</p>
                                                    <p className="text-red-500 font-bold text-2xl">₹{formData.startingBid}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Auction Ends</p>
                                                    <p className="text-yellow-400 font-semibold">
                                                        {formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Not set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {submitting && (
                                        <div className="text-center">
                                            <div className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 text-sm mt-2">Listing your item...</p>
                                        </div>
                                    )}

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
