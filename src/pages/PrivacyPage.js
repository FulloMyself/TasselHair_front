import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-12"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary-brown mb-6">
          Privacy Policy
        </h1>
        <p className="text-text-dark mb-8">
          Last updated: March 2026
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              1. Introduction
            </h2>
            <p className="text-text-dark">
              Tassel Beauty & Wellness Studio ("we," "our," or "us") is committed to protecting your 
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              2. Information We Collect
            </h2>
            <h3 className="font-semibold text-text-dark mb-2">2.1 Personal Information</h3>
            <p className="text-text-dark mb-2">
              We may collect personal information including:
            </p>
            <ul className="list-disc list-inside text-text-dark ml-4 mb-3">
              <li>Name and surname</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Physical address</li>
              <li>Date of birth</li>
              <li>Payment information</li>
              <li>Appointment history</li>
              <li>Purchase history</li>
            </ul>

            <h3 className="font-semibold text-text-dark mb-2">2.2 Automatically Collected Information</h3>
            <p className="text-text-dark">
              When you visit our website, we may automatically collect information about your device, 
              browsing actions, and usage patterns through cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-text-dark mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Process your appointments and orders</li>
              <li>Communicate with you about your bookings</li>
              <li>Send appointment reminders and confirmations</li>
              <li>Process payments</li>
              <li>Improve our services and website</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              4. POPIA Compliance
            </h2>
            <p className="text-text-dark mb-2">
              We comply with the Protection of Personal Information Act (POPIA) of South Africa. 
              This means we:
            </p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Collect information only for specified, lawful purposes</li>
              <li>Process information fairly and lawfully</li>
              <li>Keep information accurate and up to date</li>
              <li>Store information securely</li>
              <li>Limit data retention to necessary periods</li>
              <li>Respect your rights to access and correct your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              5. Information Sharing
            </h2>
            <p className="text-text-dark mb-2">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information with:
            </p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Payment processors (PayFast) for transaction processing</li>
              <li>Courier services for deliveries</li>
              <li>Service providers who assist in operating our business</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              6. Data Security
            </h2>
            <p className="text-text-dark">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. All 
              payment transactions are encrypted using SSL technology.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              7. Your Rights
            </h2>
            <p className="text-text-dark mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              8. Cookies
            </h2>
            <p className="text-text-dark">
              Our website uses cookies to enhance your browsing experience. You can set your browser 
              to refuse cookies, but this may limit some functionality of our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              9. Children's Privacy
            </h2>
            <p className="text-text-dark">
              Our services are not directed to individuals under 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from 
              a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              10. Changes to This Policy
            </h2>
            <p className="text-text-dark">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary-brown mb-3">
              11. Contact Us
            </h2>
            <p className="text-text-dark mb-2">
              If you have questions about this Privacy Policy or wish to exercise your rights, 
              please contact our Information Officer:
            </p>
            <ul className="list-disc list-inside text-text-dark ml-4">
              <li>Email: privacy@tasselgroup.co.za</li>
              <li>Phone: +27 72 960 5153</li>
              <li>Address: 55 True North Road, Mulbarton, Gauteng</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-dark">
            For more information about POPIA, visit the{' '}
            <a 
              href="https://www.justice.gov.za/inforeg/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-pink hover:underline"
            >
              Information Regulator (South Africa)
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;