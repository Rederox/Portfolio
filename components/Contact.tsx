/* eslint-disable react/no-unescaped-entities */
import React, { useState, FormEvent } from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi"; // Import icons

type ContactFormProps = {
  onSubmit: (name: string, email: string, message: string) => void;
};

const Contact: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, message);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center mx-auto max-w-full overflow-hidden relative z-0 text-white">
      <h2 className="absolute top-[4rem] uppercase tracking-[7px] text-gray-500 text-2xl md:text-4xl w-full">
        Contactez-moi
      </h2>
      <p className="absolute top-[6rem] text-lg md:text-xl w-full text-gray-500">
        N'hésitez pas à me contacter pour toute question ou demande.
      </p>
      <div className="flex flex-col items-center space-y-2 mb-6 mt-[8rem]">
        <div className="flex items-center space-x-2">
          <FiPhone className="text-[#00ff517b]" />
          <span>07 84 96 88 40</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiMail className="text-[#00ff517b]" />
          <span>Theivathan14@gmail.com</span>
        </div>
        <div className="flex items-center space-x-2">
          <FiMapPin className="text-[#00ff517b]" />
          <span>19 rue des roses, 95100 Argenteuil, France</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 w-3/4 md:w-1/2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 bg-[#0289ff11] border border-[#0289ff3f] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00ff517b]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 bg-[#0289ff11] border-[#0289ff3f] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00ff517b]"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full px-4 py-2 bg-[#0289ff11] border-[#0289ff3f] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00ff517b] h-32"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#00ff513c] text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-[#00ff517b] focus:outline-none focus:ring-2 focus:ring-[#00ff517b]"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Contact;
