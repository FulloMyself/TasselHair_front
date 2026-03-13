import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      await axios.post('/api/contact', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: ['55 True North Road', 'Mulbarton, Gauteng', 'South Africa'],
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: ['+27 72 960 5153', '+27 11 123 4567'],
      link: 'tel:+27729605153',
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: ['info@tasselgroup.co.za', 'bookings@tasselgroup.co.za'],
      link: 'mailto:info@tasselgroup.co.za',
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9am - 5pm', 'Saturday: 9am - 5pm', 'Sunday: Closed'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/contact-hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-primary-beige">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 bg-accent-pink rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-brown mb-3">
                    {item.title}
                  </h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-text-dark">
                      {item.link ? (
                        <a href={item.link} className="hover:text-accent-pink transition">
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map and Form Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-primary-brown mb-6">
                Find Us Here
              </h2>
              <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.885123456789!2d28.123456789012345!3d-26.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95000000000000%3A0x0000000000000000!2s55%20True%20North%20Rd%2C%20Mulbarton%2C%20Johannesburg%2C%202059!5e0!3m2!1sen!2sza!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Tassel Beauty & Wellness Location"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-primary-brown mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label-primary">Your Name *</label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`input-primary ${errors.name ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-error text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-primary">Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`input-primary ${errors.email ? 'input-error' : ''}`}
                      placeholder="Your email"
                    />
                    {errors.email && (
                      <p className="text-error text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label-primary">Phone</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className={`input-primary ${errors.phone ? 'input-error' : ''}`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && (
                      <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label-primary">Subject *</label>
                  <input
                    type="text"
                    {...register('subject')}
                    className={`input-primary ${errors.subject ? 'input-error' : ''}`}
                    placeholder="What is this about?"
                  />
                  {errors.subject && (
                    <p className="text-error text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-primary">Message *</label>
                  <textarea
                    {...register('message')}
                    rows="5"
                    className={`input-primary ${errors.message ? 'input-error' : ''}`}
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p className="text-error text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-primary-beige">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-primary-brown mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-dark mb-8">
            Find answers to common questions about our services, bookings, and policies.
          </p>
          <a href="/faq" className="btn-secondary inline-block">
            View FAQ
          </a>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;