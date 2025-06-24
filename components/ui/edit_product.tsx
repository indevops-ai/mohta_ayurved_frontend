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
import { ArrowRight, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onUpdate: (product: any) => void;
}

type PriceRow = {
  sr_no: string;
  qty: string;
  price: string;
};

export default function EditProductForm({
  isOpen,
  onClose,
  product,
  onUpdate,
}: EditProductFormProps) {
  const { toast } = useToast();

  const [category, setCategory] = React.useState(product.category || "");
  const [name, setName] = React.useState(product.name || "");
  const [description, setDescription] = React.useState(
    product.description || ""
  );

  const [proUsage, setProUsage] = React.useState(
    product.proprietary_fields?.usage || ""
  );
  const [proIngredients, setProIngredients] = React.useState(
    product.proprietary_fields?.ingredients || ""
  );
  const [proDosage, setProDosage] = React.useState(
    product.proprietary_fields?.dosage || ""
  );
  const [proPrices, setProPrices] = React.useState<PriceRow[]>(
    product.proprietary_fields?.price_list?.length > 0
      ? product.proprietary_fields.price_list
      : [{ sr_no: "", qty: "", price: "" }]
  );

  const [subCategory, setSubCategory] = React.useState(
    product.classical_fields?.sub_category || ""
  );
  const [classUsage, setClassUsage] = React.useState(
    product.classical_fields?.usage || ""
  );
  const [classIngredients, setClassIngredients] = React.useState(
    product.classical_fields?.ingredients || ""
  );
  const [dosageAnupan, setDosageAnupan] = React.useState(
    product.classical_fields?.dosage_anupan || ""
  );
  const [reference, setReference] = React.useState(
    product.classical_fields?.reference || ""
  );
  const [classPrices, setClassPrices] = React.useState<PriceRow[]>(
    product.classical_fields?.price_list?.length > 0
      ? product.classical_fields.price_list
      : [{ sr_no: "", qty: "", price: "" }]
  );

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

  const removePriceRow = (index: number, type: "proprietary" | "classical") => {
    const list = type === "proprietary" ? [...proPrices] : [...classPrices];
    if (list.length > 1) {
      list.splice(index, 1);
      type === "proprietary" ? setProPrices(list) : setClassPrices(list);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct: any = {
      id: product.id,
      documentId: product.documentId, // Include documentId for the API call
      name,
      category,
      description,
    };

    if (category === "proprietary") {
      updatedProduct.proprietary_fields = {
        // Don't include the component ID - let Strapi handle it
        usage: proUsage,
        ingredients: proIngredients,
        dosage: proDosage,
        price_list: proPrices.filter(
          (row) => row.sr_no || row.qty || row.price // Only include non-empty rows
        ),
      };
    } else if (category === "classical") {
      updatedProduct.classical_fields = {
        // Don't include the component ID - let Strapi handle it
        sub_category: subCategory,
        usage: classUsage,
        ingredients: classIngredients,
        dosage_anupan: dosageAnupan,
        reference,
        price_list: classPrices.filter(
          (row) => row.sr_no || row.qty || row.price // Only include non-empty rows
        ),
      };
    }

    onUpdate(updatedProduct);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
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

              <div className="space-y-2">
                <h4 className="font-medium">Price List</h4>
                {proPrices.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
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
                    {proPrices.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePriceRow(idx, "proprietary")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addPriceRow("proprietary")}
                >
                  Add Row
                </Button>
              </div>
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

              <div className="space-y-2">
                <h4 className="font-medium">Price List</h4>
                {classPrices.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
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
                        handlePriceChange(
                          idx,
                          "qty",
                          e.target.value,
                          "classical"
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
                          "classical"
                        )
                      }
                    />
                    {classPrices.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePriceRow(idx, "classical")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={() => addPriceRow("classical")}>
                  Add Row
                </Button>
              </div>
            </>
          )}

          <Button type="submit" className="bg-black text-white rounded-full">
            Update <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
