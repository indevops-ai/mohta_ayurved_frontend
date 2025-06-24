"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { Pencil, LogOut, User } from "lucide-react";
import AddProductForm from "@/components/ui/add_product";
import EditProductForm from "@/components/ui/edit_product";
import { isAuthenticated, getAuthToken, getUser, logout } from "@/utils/auth";

interface Product {
  id: number;
  documentId: string; // Added documentId
  name: string;
  category: string;
  description: string;
  proprietary_fields?: any;
  classical_fields?: any;
}

export default function ProductDashboard() {
  const { toast } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false); // Add client-side flag
  const [authChecked, setAuthChecked] = useState(false); // Add auth check flag

  const apiToken = getAuthToken();

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication on component mount (only on client)
  useEffect(() => {
    if (!isClient) return; // Don't run on server

    if (!isAuthenticated()) {
      toast({
        description: "Please login to access this page",
        variant: "destructive",
      });
      router.push("/login");
    } else {
      setUser(getUser());
      setAuthChecked(true);
      fetchProducts();
    }
    setIsLoading(false);
  }, [isClient, router, toast]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "http://34.68.44.252:1337/api/products?populate[proprietary_fields][populate]=price_list&populate[classical_fields][populate]=price_list",
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      if (res.status === 401) {
        // Token expired or invalid
        handleLogout();
        return;
      }
      const json = await res.json();
      setProducts(json.data);
    } catch (err) {
      console.error(err);
      toast({
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsEditOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      description: "Logged out successfully",
    });
    router.push("/login");
  };

  const handleUpdate = async (updatedProduct: Product) => {
    try {
      const data: any = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        description: updatedProduct.description,
      };

      if (updatedProduct.category === "proprietary") {
        data.proprietary_fields = {
          usage: updatedProduct.proprietary_fields?.usage,
          ingredients: updatedProduct.proprietary_fields?.ingredients,
          dosage: updatedProduct.proprietary_fields?.dosage,
          price_list: (updatedProduct.proprietary_fields?.price_list || []).map(
            (item: {
              id?: number;
              sr_no: number | string;
              qty: string;
              price: string;
            }) => {
              const { id, ...rest } = item;
              return rest;
            }
          ),
        };
        // Clear classical fields when switching to proprietary
        data.classical_fields = null;
      }

      if (updatedProduct.category === "classical") {
        data.classical_fields = {
          sub_category: updatedProduct.classical_fields?.sub_category,
          usage: updatedProduct.classical_fields?.usage,
          ingredients: updatedProduct.classical_fields?.ingredients,
          dosage_anupan: updatedProduct.classical_fields?.dosage_anupan,
          reference: updatedProduct.classical_fields?.reference,
          price_list: (updatedProduct.classical_fields?.price_list || []).map(
            (item: {
              id?: number;
              sr_no: number | string;
              qty: string;
              price: string;
            }) => {
              const { id, ...rest } = item;
              return rest;
            }
          ),
        };
        // Clear proprietary fields when switching to classical
        data.proprietary_fields = null;
      }

      // Use documentId instead of id for Strapi v5
      const res = await fetch(
        `http://34.68.44.252:1337/api/products/${updatedProduct.documentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        }
      );

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (res.ok) {
        toast({ description: "Product updated successfully!" });
        setIsEditOpen(false);
        fetchProducts();
      } else {
        const error = await res.json();
        console.error("Update error:", error);
        toast({
          description: error?.error?.message || "Failed to update product",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast({ description: "Server error", variant: "destructive" });
    }
  };

  // Show loading state during hydration and authentication check
  if (!isClient || isLoading || !authChecked) {
    return (
      <div className="p-6 mt-20 mb-20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the dashboard if not authenticated (only after client-side check)
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="p-6 mt-20 mb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <User className="w-4 h-4" />
              <span>Welcome, {user.username || user.email}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="rounded-full bg-black text-white"
          >
            Add New Product
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 capitalize">{product.category}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {products === null
                    ? "Loading products..."
                    : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Dialog */}
      <AddProductForm
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          fetchProducts();
        }}
      />

      {/* Edit Product Dialog */}
      {isEditOpen && editProduct && (
        <EditProductForm
          isOpen={isEditOpen}
          product={editProduct}
          onClose={() => setIsEditOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
