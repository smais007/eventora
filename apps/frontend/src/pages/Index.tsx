import React from "react";
import Navbar from "@/components/Navbar";
import Homepage from "@/pages/Homepage";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
};

export default Index;
