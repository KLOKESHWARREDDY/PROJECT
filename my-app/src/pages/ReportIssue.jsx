import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    MessageSquare,
    Tag,
    Upload,
    Paperclip,
    Send
} from 'lucide-react';
import styles from './ReportIssue.module.css';

const ReportIssue = ({ theme = 'light' }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fileName, setFileName] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        priority: 'medium',
        screenshot: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, screenshot: file }));
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            // Reset form after success
            setTimeout(() => {
                navigate(-1); // Go back after showing success message
            }, 2500);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className={`${styles.pageWrapper} ${styles[theme]}`}>
                <div className={styles.container}>
                    <div className={styles.successCard}>
                        <div className={styles.successIconWrapper}>
                            <CheckCircle2 size={48} className={styles.successIcon} />
                        </div>
                        <h2 className={styles.successTitle}>Issue Reported Successfully</h2>
                        <p className={styles.successDesc}>
                            Thank you for letting us know. Our support team will review your report and get back to you shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.pageWrapper} ${styles[theme]}`}>
            {/* Background Glows for modern tech aesthetic */}
            <div className={`${styles.glow} ${styles.glowBlue}`}></div>
            <div className={`${styles.glow} ${styles.glowPurple}`}></div>

            <div className={styles.container}>
                {/* Header Actions */}
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className={styles.reportCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}>
                            <AlertTriangle size={28} className={styles.headerIcon} />
                        </div>
                        <div>
                            <h1 className={styles.title}>Report an Issue</h1>
                            <p className={styles.subtitle}>Let us know what's going wrong so we can fix it.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formContainer}>

                        {/* Issue Title */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <MessageSquare size={16} /> Issue Title
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                name="title"
                                placeholder="E.g., Cannot register for Hackathon"
                                value={formData.title}
                                onChange={(e) => handleInputChange({ name: 'title', value: e.target.value })}
                                required
                            />
                        </div>

                        {/* Category & Priority Row */}
                        <div className={styles.rowGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Tag size={16} /> Issue Category
                                </label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        className={styles.select}
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange({ name: 'category', value: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="technical">Technical Problem</option>
                                        <option value="login">Login Issue</option>
                                        <option value="registration">Event Registration Problem</option>
                                        <option value="payment">Payment Issue</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Priority Level</label>
                                <div className={styles.radioGroup}>
                                    <label className={`${styles.radioLabel} ${formData.priority === 'low' ? styles.radioSelected : ''}`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="low"
                                            checked={formData.priority === 'low'}
                                            onChange={(e) => handleInputChange(e.target)}
                                            className={styles.hiddenRadio}
                                        />
                                        <span className={styles.radioDot}></span>
                                        Low
                                    </label>
                                    <label className={`${styles.radioLabel} ${formData.priority === 'medium' ? styles.radioSelected : ''}`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="medium"
                                            checked={formData.priority === 'medium'}
                                            onChange={(e) => handleInputChange(e.target)}
                                            className={styles.hiddenRadio}
                                        />
                                        <span className={styles.radioDot}></span>
                                        Medium
                                    </label>
                                    <label className={`${styles.radioLabel} ${formData.priority === 'high' ? styles.radioSelected : ''} ${styles.radioHigh}`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            value="high"
                                            checked={formData.priority === 'high'}
                                            onChange={(e) => handleInputChange(e.target)}
                                            className={styles.hiddenRadio}
                                        />
                                        <span className={styles.radioDot}></span>
                                        High
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Description
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="description"
                                placeholder="Please describe the issue in detail. What were you trying to do?"
                                value={formData.description}
                                onChange={(e) => handleInputChange({ name: 'description', value: e.target.value })}
                                required
                                rows={5}
                            />
                        </div>

                        {/* File Upload */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Paperclip size={16} /> Attach Screenshot (Optional)
                            </label>
                            <label className={styles.uploadArea}>
                                <input
                                    type="file"
                                    className={styles.hiddenInput}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className={styles.uploadContent}>
                                    <Upload size={24} className={styles.uploadIcon} />
                                    {fileName ? (
                                        <span className={styles.fileName}>{fileName}</span>
                                    ) : (
                                        <>
                                            <span className={styles.uploadText}>Click to upload or drag and drop</span>
                                            <span className={styles.uploadSub}>PNG, JPG, GIF up to 5MB</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Submit Actions */}
                        <div className={styles.formActions}>
                            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)} disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Issue
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;
