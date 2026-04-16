"use client";

import { Input, Button, Link } from "@heroui/react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";

import logo from "@/src/assets/images/24331527_4800_2_09.jpg";

const Footer = () => {
  return (
    <footer className="pt-16 pb-0">
      <div className="container mx-auto px-4  ">
        <div className="flex flex-row justify-center items-center mt-8">
          <Image
            alt="fishCove logo"
            className=" mb-2"
            height={42}
            src={logo}
            width={42}
          />
          <h2 className="text-2xl font-semibold text-customBlue">
            fishCove
          </h2>{" "}
        </div>

        <p className="text-center text-[#000000] mb-12 mt-2 max-w-3xl mx-auto">
          {/* Black for text */}
          Welcome to fishCove, your ultimate destination for expert advice and
          captivating stories about aquatic life. Dive into our resources to
          enhance your knowledge and care for your fish companions!
        </p>

        <div className="md:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-customBlue mb-4">
              We Social
            </h3>{" "}
            {/* Deep Teal */}
            <div className="flex justify-center space-x-4">
              <Link className="text-gray-400 hover:text-customOrange" href="#">
                <Facebook size={24} />
              </Link>
              <Link className="text-gray-400 hover:text-customOrange" href="#">
                <Twitter size={24} />
              </Link>
              <Link className="text-gray-400 hover:text-customOrange" href="#">
                <Linkedin size={24} />
              </Link>
              <Link className="text-gray-400 hover:text-customOrange" href="#">
                <Instagram size={24} />
              </Link>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-customBlue mb-4">
              Subscribe Now!
            </h3>{" "}
            {/* Deep Teal */}
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                className="flex-grow"
                placeholder="Your Email Address"
                type="email"
              />
              <Button className="w-full sm:w-auto">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-[#F4E3D7] py-4">
        <p className="text-center text-xs text-[#000000]">
          Copyright © 2023 fishCove All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
