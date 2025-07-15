import { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import LoadingButton from '../components/LoadingButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with actual contact form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center lg:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full lg:max-w-[360px] rounded-lg"
          src={assets.contact_image}
          alt="Contact Us"
        />

        <div className="flex flex-col justify-center items-start gap-6 lg:max-w-md">
          <div>
            <p className="font-semibold text-lg text-gray-600 mb-3">
              OUR OFFICE
            </p>
            <div className="space-y-2 text-gray-500">
              <p>
                📍 Lovely Road
                <br />
                Subid Bazar, Sylhet
              </p>
              <p>📞 Tel: (+880) 1768-646490</p>
              <p>✉️ Email: mirza@gmail.com</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-lg text-gray-600 mb-2">
              CAREERS AT MIRZA
            </p>
            <p className="text-gray-500 mb-4">
              Learn more about our teams and job openings.
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-md">
              Explore Jobs
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border rounded-lg p-6 lg:max-w-md shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Send us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-3 border rounded-md transition-colors ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-3 border rounded-md transition-colors ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={`w-full p-3 border rounded-md transition-colors ${
                  errors.subject
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                disabled={loading}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className={`w-full p-3 border rounded-md transition-colors resize-none ${
                  errors.message
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                disabled={loading}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full py-3 rounded-md text-base"
              disabled={loading}
            >
              Send Message
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
