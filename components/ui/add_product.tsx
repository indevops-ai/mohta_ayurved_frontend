"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductForm({ isOpen, onClose }: AddProductProps) {
  const { toast } = useToast();

  const [category, setCategory] = React.useState<string>("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<File | null>(null);

  // Proprietary Fields
  const [proUsage, setProUsage] = React.useState("");
  const [proIngredients, setProIngredients] = React.useState("");
  const [proDosage, setProDosage] = React.useState("");
  const [proPrices, setProPrices] = React.useState([
    { sr_no: "", qty: "", price: "" },
  ]);

  // Classical Fields
  const [subCategory, setSubCategory] = React.useState("");
  const [classUsage, setClassUsage] = React.useState("");
  const [classIngredients, setClassIngredients] = React.useState("");
  const [dosageAnupan, setDosageAnupan] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [classPrices, setClassPrices] = React.useState([
    { sr_no: "", qty: "", price: "" },
  ]);

  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

  type PriceFieldKey = "sr_no" | "qty" | "price";

  const handlePriceChange = (
    index: number,
    field: PriceFieldKey,
    value: string,
    type: "proprietary" | "classical"
  ) => {
    const list = type === "proprietary" ? [...proPrices] : [...classPrices];
    list[index][field] = value;
    type === "proprietary" ? setProPrices(list) : setClassPrices(list);
  };

  const addPriceRow = (type: "proprietary" | "classical") => {
    const newRow = { sr_no: "", qty: "", price: "" };
    type === "proprietary"
      ? setProPrices([...proPrices, newRow])
      : setClassPrices([...classPrices, newRow]);
  };

  const resetForm = () => {
    setCategory("");
    setName("");
    setDescription("");
    setThumbnail(null);
    setImage(null);

    // Reset proprietary fields
    setProUsage("");
    setProIngredients("");
    setProDosage("");
    setProPrices([{ sr_no: "", qty: "", price: "" }]);

    // Reset classical fields
    setSubCategory("");
    setClassUsage("");
    setClassIngredients("");
    setDosageAnupan("");
    setReference("");
    setClassPrices([{ sr_no: "", qty: "", price: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      name,
      category,
      description,
    };

    if (category === "proprietary") {
      data.proprietary_fields = {
        usage: proUsage,
        ingredients: proIngredients,
        dosage: proDosage,
        price_list: proPrices,
      };
    } else if (category === "classical") {
      data.classical_fields = {
        sub_category: subCategory,
        usage: classUsage,
        ingredients: classIngredients,
        dosage_anupan: dosageAnupan,
        reference,
        price_list: classPrices,
      };
    }

    try {
      const res = await fetch("http://34.68.44.252:1337/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (res.ok) {
        toast({ description: "Product added successfully!" });
        resetForm();
        onClose();
      } else {
        toast({ description: "Error adding product.", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ description: "Server error.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proprietary">Proprietary</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
            </SelectContent>
          </Select>

          {category === "proprietary" && (
            <>
              <Textarea
                placeholder="Usage"
                value={proUsage}
                onChange={(e) => setProUsage(e.target.value)}
              />
              <Textarea
                placeholder="Ingredients"
                value={proIngredients}
                onChange={(e) => setProIngredients(e.target.value)}
              />
              <Textarea
                placeholder="Dosage"
                value={proDosage}
                onChange={(e) => setProDosage(e.target.value)}
              />

              {proPrices.map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Sr No"
                    value={row.sr_no}
                    onChange={(e) =>
                      handlePriceChange(
                        idx,
                        "sr_no",
                        e.target.value,
                        "proprietary"
                      )
                    }
                  />
                  <Input
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) =>
                      handlePriceChange(
                        idx,
                        "qty",
                        e.target.value,
                        "proprietary"
                      )
                    }
                  />
                  <Input
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) =>
                      handlePriceChange(
                        idx,
                        "price",
                        e.target.value,
                        "proprietary"
                      )
                    }
                  />
                </div>
              ))}
              <Button type="button" onClick={() => addPriceRow("proprietary")}>
                Add Row
              </Button>
            </>
          )}

          {category === "classical" && (
            <>
              <Textarea
                placeholder="Sub-category"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              />
              <Textarea
                placeholder="Usage"
                value={classUsage}
                onChange={(e) => setClassUsage(e.target.value)}
              />
              <Textarea
                placeholder="Ingredients"
                value={classIngredients}
                onChange={(e) => setClassIngredients(e.target.value)}
              />
              <Textarea
                placeholder="Dosage Anupan"
                value={dosageAnupan}
                onChange={(e) => setDosageAnupan(e.target.value)}
              />
              <Textarea
                placeholder="Reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />

              {classPrices.map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Sr No"
                    value={row.sr_no}
                    onChange={(e) =>
                      handlePriceChange(
                        idx,
                        "sr_no",
                        e.target.value,
                        "classical"
                      )
                    }
                  />
                  <Input
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) =>
                      handlePriceChange(idx, "qty", e.target.value, "classical")
                    }
                  />
                  <Input
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) =>
                      handlePriceChange(
                        idx,
                        "price",
                        e.target.value,
                        "classical"
                      )
                    }
                  />
                </div>
              ))}
              <Button type="button" onClick={() => addPriceRow("classical")}>
                Add Row
              </Button>
            </>
          )}

          <Button type="submit" className="bg-black text-white rounded-full">
            Submit <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
