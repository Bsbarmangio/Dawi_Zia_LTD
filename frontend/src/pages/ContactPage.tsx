import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { contactApi, ContactInquiry } from '../utils/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactApi.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['+251-11-234-5678', '+251-11-234-5679'],
      action: 'tel:+251112345678'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@dawizia.com', 'sales@dawizia.com'],
      action: 'mailto:info@dawizia.com'
    },
    {
      icon: MapPinIcon,
      title: 'Head Office',
      details: ['Addis Ababa, Ethiopia', 'Bole Sub-City'],
      action: null
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero text-white section-padding">
        <div className="container-custom text-center space-y-8">
          <h1 className="text-4xl lg:text-6xl font-bold">Contact Us</h1>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help with all your poultry farming needs.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-secondary-900">Send us a Message</h2>
                <p className="text-secondary-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-success-50 border border-success-200 rounded-lg p-6 text-center">
                  <h3 className="text-success-800 font-semibold text-lg mb-2">
                    Thank you for your message!
                  </h3>
                  <p className="text-success-600">
                    We've received your inquiry and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+251-XX-XXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Pricing">Pricing</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-secondary-900">Get in Touch</h2>
                <p className="text-secondary-600">
                  Reach out to us through any of these channels. We're here to help!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-secondary-600">
                              {info.action ? (
                                <a href={info.action} className="hover:text-primary-600 transition-colors">
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card p-6 bg-primary-50 border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                  Business Hours
                </h3>
                <div className="space-y-2 text-primary-800">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};