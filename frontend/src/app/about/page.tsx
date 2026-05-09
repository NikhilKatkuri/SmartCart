'use client';

import { Mail, Phone, MapPin, Zap, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About SmartCart</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Your intelligent shopping companion powered by AI-driven product insights
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              At SmartCart, we believe shopping should be intelligent, intuitive, and personalized.
              Our mission is to revolutionize the e-commerce experience by combining cutting-edge
              AI technology with a clean, user-friendly interface.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We empower users to make informed purchasing decisions by providing detailed product
              analysis, intelligent comparisons, and AI-powered insights at their fingertips.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <Target className="w-16 h-16 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Shopping</h3>
            <p className="text-gray-600">
              Make better purchasing decisions with AI-powered product insights and intelligent
              recommendations.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose SmartCart?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Experience blazing-fast product search and comparison with real-time data.',
              },
              {
                icon: Users,
                title: 'User-Centric',
                description: 'Designed with your needs in mind. Simple, intuitive, and powerful.',
              },
              {
                title: 'AI-Powered',
                icon: Target,
                description: 'Get intelligent product recommendations and analysis using advanced AI.',
              },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Browsing</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Advanced filtering by category, price, and rating</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Full-text search across thousands of products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Responsive design works on all devices</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Compare up to 3 products side-by-side</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>AI-powered chat for product insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Save favorites to wishlist and manage cart</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:support@smartcart.com" className="text-blue-600 hover:underline">
                  support@smartcart.com
                </a>
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                  +1 (234) 567-890
                </a>
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">
                123 Commerce Street<br />
                Tech City, TC 12345
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            SmartCart is built by a dedicated team of engineers, designers, and product experts
            passionate about transforming the e-commerce experience through technology and
            innovation.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {['Product Team', 'Engineering', 'Design'].map((role, idx) => (
              <div key={idx}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{role}</h3>
                <p className="text-gray-600">Experts in their craft</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop Smarter?</h2>
          <p className="text-blue-100 mb-6">
            Explore thousands of products with AI-powered insights
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
