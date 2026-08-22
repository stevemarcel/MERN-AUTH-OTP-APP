import { useState } from "react";
import { useSendContactMessageMutation } from "../slices/contactApiSlice";

import { Link } from "react-router-dom";

import contactHeroImage from "../assets/img/hero/contact-hero.avif";

import Hero from "../components/Hero";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaBehance,
  FaInstagram,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

const ContactPage = () => {
  const contactLinks = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      value: "Get in touch via email",
      href: "mailto:just.stevemarcel@gmail.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      value: "Lagos, Nigeria",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/stephen-onyejuluwa-098733190",
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      href: "https://github.com/stevemarcel",
    },
    {
      icon: <FaBehance />,
      label: "Behance",
      href: "https://www.behance.net/sharkcoloursng",
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      href: "https://instagram.com/sharkcoloursng",
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // const [feedback, setFeedback] = useState({
  //   type: "",
  //   message: "",
  // });

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await sendContactMessage(formData).unwrap();

      toast.success(res.message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-light text-shark">
      {/* Hero */}
      <Hero
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s Start a <span className="text-sharkLight-300">Conversation.</span>
          </>
        }
        description="Have a question about the project, want to discuss an idea, or simply want to connect? I'd be happy to hear from you."
        backgroundImage={contactHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
          >
            Reach Out
            <FaArrowRight />
          </a>

          <Link
            to="/features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sharkLight-300/40 text-light font-semibold rounded-md hover:bg-light/10 transition duration-200"
          >
            Explore Features
          </Link>
        </div>
      </Hero>

      {/* Contact Section */}
      <main id="contact" className="w-[90%] max-w-6xl mx-auto py-16 md:py-20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          {/* Contact Information */}
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-sharkLight-300 mb-3">
              Contact
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-shark">Get in touch</h2>

            <p className="mt-4 text-sharkLight-300 leading-relaxed max-w-md">
              Whether you have feedback about the application, a project opportunity, or a technical
              question, feel free to reach out.
            </p>

            {/* Contact Details */}
            <div className="mt-8 space-y-4">
              {contactLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-sharkLight-200 hover:border-sharkLight-300 hover:bg-sharkLight-100/30 transition duration-200"
                >
                  <div className="w-11 h-11 rounded-lg bg-sharkLight-100 flex items-center justify-center text-shark">
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-semibold text-shark">{item.title}</p>
                    <p className="text-sm text-sharkLight-300 mt-1">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <p className="text-sm font-semibold text-shark mb-4">Connect with me</p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-sharkLight-100 flex items-center justify-center text-shark hover:bg-shark hover:text-light transition duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="bg-white rounded-2xl shadow-sm border border-sharkLight-200 p-6 md:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-shark">Send a message</h2>

              <p className="text-sm text-sharkLight-300 mt-2">
                Fill out the form below and I&apos;ll get back to you.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submitHandler}>
              {/* Name */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-shark mb-2">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg border border-sharkLight-200 bg-light focus:outline-none focus:ring-2 focus:ring-shark/20 focus:border-shark transition"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-shark mb-2">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Obi"
                    className="w-full px-4 py-3 rounded-lg border border-sharkLight-200 bg-light focus:outline-none focus:ring-2 focus:ring-shark/20 focus:border-shark transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-shark mb-2">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="johnobi@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-sharkLight-200 bg-light focus:outline-none focus:ring-2 focus:ring-shark/20 focus:border-shark transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-shark mb-2">
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can I help?"
                  className="w-full px-4 py-3 rounded-lg border border-sharkLight-200 bg-light focus:outline-none focus:ring-2 focus:ring-shark/20 focus:border-shark transition"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-shark mb-2">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me a little about what you'd like to discuss..."
                  className="w-full px-4 py-3 rounded-lg border border-sharkLight-200 bg-light resize-none focus:outline-none focus:ring-2 focus:ring-shark/20 focus:border-shark transition"
                />
              </div>

              {/* {feedback.message && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )} */}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3 bg-shark text-light font-semibold rounded-lg hover:bg-sharkDark-100 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Message"}

                <FaPaperPlane className={`text-sm ${isLoading ? "animate-pulse" : ""}`} />
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* Closing CTA */}
      <section className="bg-sharkLight-100/40 border-t border-sharkLight-200">
        <div className="w-[90%] max-w-4xl mx-auto py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sharkLight-300 mb-3">
            Still exploring?
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-shark">
            See what the application can do.
          </h2>

          <p className="mt-4 text-sharkLight-300 max-w-2xl mx-auto">
            Explore the authentication, user management, administration, and security features built
            into the platform.
          </p>

          <a
            href="/register"
            className="inline-flex items-center gap-3 mt-7 px-7 py-3 bg-shark text-light font-semibold rounded-lg hover:bg-sharkDark-100 transition duration-200"
          >
            Explore the Platform
            <FaArrowRight />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
