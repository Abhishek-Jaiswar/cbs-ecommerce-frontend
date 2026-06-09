"use client";

import * as React from "react";
import {
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} from "@/services/api/addresses/addresses-api";
import { Address } from "@/services/api/addresses/addresses-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  User as UserIcon,
} from "lucide-react";

export default function AddressesPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Query
  const { data, isLoading, isError, refetch } = useGetAllAddressesQuery({
    page,
    limit,
  });

  const addresses = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutation
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  // Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [addressToDelete, setAddressToDelete] = React.useState<Address | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Search filter local list items
  const filteredAddresses = addresses.filter(
    (a: Address) =>
      a.fullname.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.state.toLowerCase().includes(search.toLowerCase()) ||
      a.postalCode.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  // Trigger Delete Action
  const handleDeleteTrigger = (address: Address) => {
    setErrorMsg("");
    setSuccessMsg("");
    setAddressToDelete(address);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await deleteAddress(addressToDelete.id).unwrap();

      if (response.success) {
        setSuccessMsg("Address record deleted successfully.");
        setTimeout(() => {
          setIsDeleteOpen(false);
          setAddressToDelete(null);
        }, 800);
      } else {
        setErrorMsg(response.message || "Failed to delete address.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(errorData?.data?.message || "Failed to remove address.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Addresses Registry
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Audit system-wide customer addresses, review billing/shipping defaults, and manage delivery registries.
          </p>
        </div>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search recipient, city, state, or user email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredAddresses.length} address records
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Loading system addresses...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve address database. Verify the backend service is running and Redis cache is active.
            </p>
            <Button onClick={refetch} variant="outline" className="mt-4 gap-2">
              Try Reconnecting
            </Button>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                <TableRow className="border-b border-stone-200 dark:border-stone-800">
                  <TableHead>Linked Customer</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Address Details</TableHead>
                  <TableHead>City & Region</TableHead>
                  <TableHead>Defaults</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAddresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-stone-400">
                      No address records found matching filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAddresses.map((a: Address) => (
                    <TableRow
                      key={a.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5 py-1">
                          <span className="font-medium text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1">
                            <UserIcon className="h-3 w-3 text-stone-400" />
                            {a.user?.name || "Deleted User"}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-stone-400" />
                            {a.user?.email || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-stone-900 dark:text-stone-50">
                            {a.fullname}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {a.phoneNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-stone-700 dark:text-stone-300 text-xs truncate">
                            {a.addressLine1}
                          </span>
                          {(a.addressLine2 || a.landmark) && (
                            <span className="text-[10px] text-stone-400 truncate">
                              {a.addressLine2}
                              {a.addressLine2 && a.landmark ? " | " : ""}
                              {a.landmark ? `Lm: ${a.landmark}` : ""}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-xs text-stone-600 dark:text-stone-400">
                          <span>
                            {a.city}, {a.state}
                          </span>
                          <span className="text-[10px] uppercase font-semibold">
                            {a.postalCode} | {a.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {a.isDefaultShipping && (
                            <Badge className="bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold py-0.5 px-1.5">
                              Shipping
                            </Badge>
                          )}
                          {a.isDefaultBilling && (
                            <Badge className="bg-blue-550/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] uppercase font-bold py-0.5 px-1.5">
                              Billing
                            </Badge>
                          )}
                          {!a.isDefaultShipping && !a.isDefaultBilling && (
                            <span className="text-stone-300 text-xs">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(a)}
                          className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                          title="Delete Address"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400 font-mono">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-serif font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Remove Address Record
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Confirm deleting this customer delivery location registry.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs rounded">
              <p>{successMsg}</p>
            </div>
          )}

          {addressToDelete && (
            <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <p>
                Recipient:{" "}
                <span className="font-bold text-stone-900 dark:text-white">
                  {addressToDelete.fullname}
                </span>
              </p>
              <p className="bg-stone-50 dark:bg-stone-900 p-2 border rounded font-mono text-[10px] text-stone-500 leading-tight">
                {addressToDelete.addressLine1}, {addressToDelete.city}, {addressToDelete.state} - {addressToDelete.postalCode}
              </p>
              <p className="text-[10px] text-stone-400 leading-normal">
                Altering this database item removes this delivery record from customer lists. Note: This will not delete past orders utilizing this address.
              </p>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-6 font-bold"
            >
              {isDeleting && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              Delete Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
