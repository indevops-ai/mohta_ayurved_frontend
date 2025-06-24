"use client";

import React from "react";
import AddProductForm from "@/components/ui/add_product";
import AyurvedaHero from "@/components/ui/AyurvedaHero";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <AyurvedaHero />
      <Button className="m-4" onClick={() => setOpen(true)}>
        Add Product
      </Button>
      <AddProductForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
