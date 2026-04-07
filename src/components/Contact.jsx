import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from 'react-icons/md';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  if (!form.message.trim()) errors.message = 'Message is required.';
  return errors;
}

function Contact() {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setStatus('sending');
    emailjs
      .sendForm('service_uthan', 'template_contact', formRef.current, 'YOUR_PUBLIC_KEY')
      .then(() => { setStatus('success'); setForm({ name: '', email: '', phone: '', message: '' }); })
      .catch(() => setStatus('error'));
  }

  const inputBase = 'w-full rounded-lg border px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition';
  const inputNormal = `${inputBase} border-gray-200 bg-white`;
  const inputError = `${inputBase} border-red-400 bg-red-50`;

  return (
    <section id="contact" className="bg-warm py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-navy font-bold mb-3">Get in Touch</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Reach out and our team will get back to you shortly.
          </p>
        </div>

        {/* Contact card */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl mb-10">
          {/* Left info panel */}
          <div className="bg-navy text-white p-10 flex flex-col gap-8">
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-2">Contact Information</h3>
              <p className="text-white/70 text-sm leading-relaxed">Stop by, give us a call, or send us an email.</p>
            </div>
            <ul className="flex flex-col gap-6 text-sm">
              <li className="flex items-start gap-4">
                <MdLocationOn size={22} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <address className="not-italic leading-relaxed text-white/90">
                  1872 Deer Park Avenue<br />Deer Park, New York 11729
                </address>
              </li>
              <li className="flex items-center gap-4">
                <MdPhone size={22} className="text-gold shrink-0" aria-hidden="true" />
                <a href="tel:5165100267" className="text-white/90 hover:text-gold transition">(516) 510-0267</a>
              </li>
              <li className="flex items-center gap-4">
                <MdEmail size={22} className="text-gold shrink-0" aria-hidden="true" />
                <a href="mailto:uthancare@uthanseniorcare.com" className="text-white/90 hover:text-gold transition break-all">
                  uthancare@uthanseniorcare.com
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MdAccessTime size={22} className="text-gold mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-white/90 leading-relaxed">Monday – Friday<br />10:00 AM – 3:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Right form panel */}
          <div className="bg-white p-10">
            {status === 'success' ? (
              <div role="alert" className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
                <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-navy font-semibold">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-xs">Thank you for reaching out. We'll be in touch shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-2 text-sm text-gold underline hover:text-navy transition">
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <h3 className="font-serif text-2xl text-navy font-semibold mb-1">Send Us a Message</h3>
                {status === 'error' && (
                  <div role="alert" className="rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 leading-relaxed">
                    Something went wrong. Please call{' '}
                    <a href="tel:5165100267" className="font-semibold underline">(516) 510-0267</a>{' '}
                    or email{' '}
                    <a href="mailto:uthancare@uthanseniorcare.com" className="font-semibold underline">uthancare@uthanseniorcare.com</a>.
                  </div>
                )}
                {[
                  { id: 'contact-name', name: 'name', type: 'text', label: 'Full Name', placeholder: 'Jane Smith' },
                  { id: 'contact-email', name: 'email', type: 'email', label: 'Email Address', placeholder: 'jane@example.com' },
                  { id: 'contact-phone', name: 'phone', type: 'tel', label: 'Phone Number', placeholder: '(555) 000-0000' },
                ].map(({ id, name, type, label, placeholder }) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label htmlFor={id} className="text-sm font-medium text-gray-700">
                      {label} <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id={id} type={type} name={name} value={form[name]} onChange={handleChange}
                      placeholder={placeholder} required aria-required="true"
                      aria-describedby={errors[name] ? `error-${name}` : undefined}
                      className={errors[name] ? inputError : inputNormal}
                    />
                    {errors[name] && <p id={`error-${name}`} role="alert" className="text-red-500 text-xs">{errors[name]}</p>}
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
                    Message <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message" name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us how we can help..." rows={4} required aria-required="true"
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    className={`${errors.message ? inputError : inputNormal} resize-none`}
                  />
                  {errors.message && <p id="error-message" role="alert" className="text-red-500 text-xs">{errors.message}</p>}
                </div>
                <button
                  type="submit" disabled={status === 'sending'}
                  className="mt-1 w-full rounded-full bg-gold text-white font-semibold py-3 px-6 hover:bg-green-dark transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.57473533853!2d-73.33145872348047!3d40.76026793465846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e82c35dd324abd%3A0x5810ba15cbd2fa75!2s1872%20Deer%20Park%20Ave%2C%20Deer%20Park%2C%20NY%2011729%2C%20USA!5e1!3m2!1sen!2sbd!4v1775577496474!5m2!1sen!2sbd"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Uthan Senior Home Care location"
          />
        </div>
      </div>
    </section>
  );
}

export default Contact;
