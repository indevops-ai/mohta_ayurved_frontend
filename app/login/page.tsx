"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("product"); // Default to product
  const router = useRouter();
  const { toast } = useToast();
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast({
        description: "Please enter both email/username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${apiDomain}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast({ description: "Logged in successfully!" });

        // Navigate based on selected radio button
        if (selectedPage === "product") {
          router.push("/product");
        } else if (selectedPage === "product-logs") {
          router.push("/product-logs");
        }
      } else {
        toast({
          description: data?.error?.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({ description: "Login error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Radio buttons for page selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Select Page:
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="product"
                  name="page-selection"
                  value="product"
                  checked={selectedPage === "product"}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="product" className="text-sm text-gray-700">
                  Product
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="product-logs"
                  name="page-selection"
                  value="product-logs"
                  checked={selectedPage === "product-logs"}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="product-logs" className="text-sm text-gray-700">
                  Product Logs
                </label>
              </div>
            </div>
          </div>

          <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
