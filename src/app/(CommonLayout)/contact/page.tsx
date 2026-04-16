"use client";
import Image from "next/image";

import bg from "@/src/assets/images/StockCake-Cosmic Koi Dance_1727673723.jpg";

const page = () => {
  return (
    <div>
      <Image
        alt="Contact Us Icon"
        className="mr-2 w-full h-[400px] border"
        height={700}
        src={bg}
        width={1200}
      />
      <div className="md:w-9/12 mx-auto w-full mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center relative overflow-hidden p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl max-w-6xl mx-auto bg-white mt-4">
          <div>
            <h2 className="text-customOrange text-3xl font-extrabold">
              Get In Touch
            </h2>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Have a specific inquiry or looking to explore new opportunities?
              Our experienced team is ready to engage with you.
            </p>

            <form>
              <div className="space-y-4 mt-8">
                <input
                  className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                  placeholder="Full Name"
                  type="text"
                />
                <input
                  className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                  placeholder="Street"
                  type="text"
                />
                <div className="grid grid-cols-2 gap-6">
                  <input
                    className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                    placeholder="City"
                    type="text"
                  />
                  <input
                    className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                    placeholder="Postcode"
                    type="text"
                  />
                </div>
                <input
                  className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                  placeholder="Phone No."
                  type="number"
                />
                <input
                  className="px-2 py-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                  placeholder="Email"
                  type="email"
                />
                <textarea
                  className="px-2 pt-3 bg-white w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 outline-none"
                  placeholder="Write Message"
                />
              </div>

              <button
                className="mt-8 flex items-center justify-center text-sm w-full rounded-md px-6 py-3 bg-primary hover:bg-cyan-600 text-white"
                type="button"
              >
                Send Message
              </button>
            </form>

            <ul className="mt-4 flex flex-wrap justify-center gap-6">
              <li className="flex items-center text-primary">
                <i className="bx bx-mail-send" style={{ fontSize: "16px" }} />
                <a className="text-sm ml-4" href="mailto:info@example.com">
                  <strong>info@example.com</strong>
                </a>
              </li>
              <li className="flex items-center text-primary">
                <i className="bx bx-phone" style={{ fontSize: "16px" }} />
                <a className="text-sm ml-4" href="tel:+158996888">
                  <strong>+158 996 888</strong>
                </a>
              </li>
            </ul>
          </div>

          <div className="relative h-full">
            <iframe
              allowFullScreen
              className="left-0 top-0 h-full w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
              frameBorder="0"
              src="https://maps.google.com/maps?q=manhattan&t=&z=13&ie=UTF8&iwloc=&output=embed"
              title="Google Map showing Manhattan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
