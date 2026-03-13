import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-12"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary-brown mb-6">
          Terms and Conditions
        </h1>
        <p className="text-text-dark mb-8">
          Last updated: March 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              1. Introduction
            </h2>
            <p className="text-text-dark mb-2">
              Welcome to Tassel Beauty & Wellness Studio. By accessing our website and using our services, 
              you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>
            <p className="text-text-dark">
              These terms govern your use of our website, booking services, product purchases, and all 
              interactions with Tassel Beauty & Wellness Studio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              2. Appointments and Bookings
            </h2>
            <h3 className="font-semibold text-text-dark mb-2">2.1 Booking Confirmation</h3>
            <p className="text-text-dark mb-2">
              All appointments require a 50% deposit to confirm your booking. This deposit is 
              non-refundable but can be transferred to another appointment with at least 24 hours' notice.
            </p>
            
            <h3 className="font-semibold text-text-dark mb-2">2.2 Cancellation Policy</h3>
            <p className="text-text-dark mb-2">
              We require at least 24 hours' notice for cancellations or rescheduling. Cancellations 
              made with less than 24 hours' notice will forfeit the deposit.
            </p>
            
            <h3 className="font-semibold text-text-dark mb-2">2.3 Late Arrivals</h3>
            <p className="text-text-dark">
              If you arrive late, we will do our best to accommodate you, but your appointment may 
              need to be shortened to avoid delaying subsequent clients. Full charges will apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              3. Products and Orders
            </h2>
            <h3 className="font-semibold text-text-dark mb-2">3.1 Product Information</h3>
            <p className="text-text-dark mb-2">
              We strive to ensure all product information is accurate. However, we cannot guarantee 
              that product descriptions, pricing, or availability are error-free.
            </p>
            
            <h3 className="font-semibold text-text-dark mb-2">3.2 Order Confirmation</h3>
            <p className="text-text-dark mb-2">
              Your order is confirmed when you receive an email confirmation. Payment must be received 
              before orders are processed.
            </p>
            
            <h3 className="font-semibold text-text-dark mb-2">3.3 Shipping and Delivery</h3>
            <p className="text-text-dark mb-2">
              Delivery times are estimates and not guaranteed. We are not responsible for delays 
              caused by courier services or circumstances beyond our control.
            </p>
            
            <h3 className="font-semibold text-text-dark mb-2">3.4 Returns and Refunds</h3>
            <p className="text-text-dark">
              Products may be returned within 14 days of purchase if unopened and in original packaging. 
              Sale items are non-refundable. Refunds will be processed to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              4. Gift Vouchers
            </h2>
            <p className="text-text-dark mb-2">
              Gift vouchers are valid for 12 months from purchase date. They are non-refundable and 
              cannot be exchanged for cash. Lost or stolen vouchers cannot be replaced.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              5. Privacy and Data Protection
            </h2>
            <p className="text-text-dark mb-2">
              We are committed to protecting your privacy. Please review our{' '}
              <Link to="/privacy" className="text-accent-pink hover:underline">
                Privacy Policy
              </Link>{' '}
              for information on how we collect, use, and protect your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              6. Intellectual Property
            </h2>
            <p className="text-text-dark">
              All content on this website, including images, text, logos, and designs, is the property 
              of Tassel Beauty & Wellness Studio and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              7. Limitation of Liability
            </h2>
            <p className="text-text-dark">
              Tassel Beauty & Wellness Studio shall not be liable for any indirect, incidental, or 
              consequential damages arising from the use of our services or products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              8. Changes to Terms
            </h2>
            <p className="text-text-dark">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting to our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              9. Contact Information
            </h2>
            <p className="text-text-dark mb-2">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Email: info@tasselgroup.co.za</li>
              <li>Phone: +27 72 960 5153</li>
              <li>Address: 55 True North Road, Mulbarton, Gauteng</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-dark">
            By using our services, you acknowledge that you have read and understood these Terms and Conditions.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsPage;