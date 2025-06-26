"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getAuthToken, isAuthenticated, getUser, logout } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Custom table components
const Table = ({ children, ...props }: any) => (
  <table className="min-w-full divide-y divide-gray-200" {...props}>
    {children}
  </table>
);

const TableHeader = ({ children, ...props }: any) => (
  <thead className="bg-gray-50" {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, ...props }: any) => (
  <tbody className="bg-white divide-y divide-gray-200" {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, ...props }: any) => (
  <tr className="hover:bg-gray-50" {...props}>
    {children}
  </tr>
);

const TableHead = ({ children, ...props }: any) => (
  <th
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ children, ...props }: any) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props}>
    {children}
  </td>
);

import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, LogOut, User } from "lucide-react";

interface AuditLog {
  id: number;
  documentId: string;
  action: string;
  entity_type: string;
  entity_id: number;
  entity_document_id: string;
  changes: any;
  previous_values: any;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  users_permissions_user: {
    id: number;
    documentId: string;
    username: string;
    email: string;
  };
}

const AuditLogsPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const apiToken = getAuthToken();
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;

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
      fetchLogs();
    }
    setLoading(false);
  }, [isClient, router, toast]);

  // Helper function to check if changes object is empty
  const isChangesEmpty = (changes: any): boolean => {
    if (!changes) return true;
    if (typeof changes !== "object") return false;
    if (Array.isArray(changes)) return changes.length === 0;
    return Object.keys(changes).length === 0;
  };

  // Fetch logs function
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiDomain}/api/audit-logs`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Handle both direct array and nested data structure
      const logsData = data.data || data;
      const validLogs = Array.isArray(logsData) ? logsData : [];

      // Filter out entries with empty changes
      const filteredLogs = validLogs.filter(
        (log) => !isChangesEmpty(log.changes)
      );

      setLogs(filteredLogs);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to fetch audit logs");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      description: "Logged out successfully",
    });
    router.push("/login");
  };

  // Deduplication logic - applied by default
  const deduplicatedLogs = useMemo(() => {
    const uniqueLogs = new Map();

    logs.forEach((log) => {
      const key = `${log.action}-${log.entity_document_id}-${JSON.stringify(
        log.changes
      )}-${JSON.stringify(log.previous_values)}`;

      // Keep the most recent log entry for duplicate keys
      if (
        !uniqueLogs.has(key) ||
        new Date(log.timestamp) > new Date(uniqueLogs.get(key).timestamp)
      ) {
        uniqueLogs.set(key, log);
      }
    });

    return Array.from(uniqueLogs.values()).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [logs]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format JSON for display
  const formatJSON = (obj: any) => {
    if (!obj || Object.keys(obj).length === 0) return "Empty";
    return JSON.stringify(obj, null, 2);
  };

  // CSV export function
  const downloadCSV = () => {
    const headers = [
      "ID",
      "Document ID",
      "Action",
      "Entity Type",
      "Entity ID",
      "Entity Document ID",
      "Username",
      "Email",
      "User ID",
      "User Document ID",
      "Changes",
      "Previous Values",
      "Timestamp",
      "Created At",
      "Updated At",
      "Published At",
      "Locale",
    ];

    const csvData = deduplicatedLogs.map((log) => [
      log.id,
      log.documentId,
      log.action,
      log.entity_type,
      log.entity_id,
      log.entity_document_id,
      log.users_permissions_user.username,
      log.users_permissions_user.email,
      log.users_permissions_user.id,
      log.users_permissions_user.documentId,
      JSON.stringify(log.changes),
      JSON.stringify(log.previous_values),
      log.timestamp,
      log.createdAt,
      log.updatedAt,
      log.publishedAt || "",
      log.locale || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading state during hydration and authentication check
  if (!isClient || loading || !authChecked) {
    return (
      <div className="container mx-auto p-6 mt-20 space-y-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the dashboard if not authenticated (only after client-side check)
  if (!isAuthenticated()) {
    return null;
  }

  const duplicatesRemoved = logs.length - deduplicatedLogs.length;

  return (
    <div className="container mx-auto p-6 mt-20 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <User className="w-4 h-4" />
              <span>Welcome, {user.username || user.email}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={fetchLogs} disabled={loading} variant="outline">
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={downloadCSV}
            disabled={deduplicatedLogs.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audit Logs ({deduplicatedLogs.length} entries)</span>
            {duplicatesRemoved > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({duplicatesRemoved} duplicates removed)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading audit logs...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : deduplicatedLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No audit logs found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Previous Values</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deduplicatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {log.users_permissions_user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.users_permissions_user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.action === "create"
                              ? "default"
                              : log.action === "update"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.entity_type}</div>
                          <div className="text-sm text-gray-500">
                            ID: {log.entity_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {formatJSON(log.changes)}
                          </pre>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {formatJSON(log.previous_values)}
                          </pre>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
