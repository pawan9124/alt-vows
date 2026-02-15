'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingId: string;
  isDemo?: boolean;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, weddingId, isDemo = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: true,
    plus_ones: 0,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('guests')
        .insert({
          wedding_id: weddingId,
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          attending: formData.attending,
          plus_ones: formData.plus_ones,
          message: formData.message.trim() || null,
        });

      if (error) throw error;

      setIsSuccess(true);

      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          attending: true,
          plus_ones: 0,
          message: '',
        });
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-cream rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                {isSuccess ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="font-serif text-3xl text-burgundy mb-2">
                      Thank You!
                    </h2>
                    <p className="font-serif text-warmBrown text-lg">
                      We've received your RSVP
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-serif text-3xl text-burgundy">
                        RSVP
                      </h2>
                      <button
                        onClick={onClose}
                        className="text-warmBrown hover:text-burgundy transition-colors text-2xl leading-none"
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block font-serif text-warmBrown mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-warmBrown/30 rounded-md bg-white text-warmBrown focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                          placeholder="Your name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-serif text-warmBrown mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full px-4 py-2 border border-warmBrown/30 rounded-md bg-white text-warmBrown focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      {/* Attending */}
                      <div>
                        <label className="block font-serif text-warmBrown mb-2">
                          Will you attend?
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleChange('attending', true)}
                            className={`flex-1 px-4 py-2 rounded-md font-serif transition-all ${formData.attending
                              ? 'bg-burgundy text-white shadow-md'
                              : 'bg-white border border-warmBrown/30 text-warmBrown hover:border-burgundy'
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChange('attending', false)}
                            className={`flex-1 px-4 py-2 rounded-md font-serif transition-all ${!formData.attending
                              ? 'bg-burgundy text-white shadow-md'
                              : 'bg-white border border-warmBrown/30 text-warmBrown hover:border-burgundy'
                              }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {/* Plus Ones */}
                      {formData.attending && (
                        <div>
                          <label className="block font-serif text-warmBrown mb-2">
                            Number of Guests (+1s)
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleChange('plus_ones', Math.max(0, formData.plus_ones - 1))
                              }
                              className="w-10 h-10 rounded-md border border-warmBrown/30 bg-white text-warmBrown hover:border-burgundy hover:bg-burgundy hover:text-white transition-all font-serif text-xl"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={formData.plus_ones}
                              onChange={(e) =>
                                handleChange('plus_ones', Math.max(0, parseInt(e.target.value) || 0))
                              }
                              min="0"
                              className="w-20 px-4 py-2 border border-warmBrown/30 rounded-md bg-white text-warmBrown text-center focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleChange('plus_ones', formData.plus_ones + 1)
                              }
                              className="w-10 h-10 rounded-md border border-warmBrown/30 bg-white text-warmBrown hover:border-burgundy hover:bg-burgundy hover:text-white transition-all font-serif text-xl"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div>
                        <label className="block font-serif text-warmBrown mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-warmBrown/30 rounded-md bg-white text-warmBrown focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 resize-none"
                          placeholder="Leave a message for the couple..."
                        />
                      </div>

                      {/* Submit Button */}
                      {isDemo && (
                        <div className="px-4 py-2.5 bg-amber-900/30 border border-amber-500/30 rounded-lg text-center">
                          <p className="text-amber-400 text-xs font-semibold">✨ Publish your site to start collecting RSVPs</p>
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={isLoading || isDemo}
                        className={`w-full py-3 rounded-md font-serif text-lg transition-colors shadow-md ${isDemo
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                          : 'bg-burgundy text-white hover:bg-burgundy/90 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                      >
                        {isDemo ? '🔒 Publish to Send RSVPs' : isLoading ? 'Submitting...' : 'Submit RSVP'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


