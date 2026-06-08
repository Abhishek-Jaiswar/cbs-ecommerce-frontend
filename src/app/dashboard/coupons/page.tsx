"use client";

import * as React from "react";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation,
} from "@/services/api/promotions/promotions-api";
import { ICoupon } from "@/services/api/promotions/promotions-api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  IndianRupee,
  Tag,
} from "lucide-react";

// Lightweight helper utilities for date formatting
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatInputDate = (dateString: string | Date) => {
  const d = new Date(dateString);
  const pad = (num: number) => num.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function CouponsPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useGetCouponsQuery({ page, limit });
  const coupons = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [toggleCouponStatus] = useToggleCouponStatusMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  // State for Dialogs
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<ICoupon | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [couponToDelete, setCouponToDelete] = React.useState<ICoupon | null>(null);

  // Form State
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = React.useState("");
  const [minOrderAmount, setMinOrderAmount] = React.useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = React.useState("");
  const [usageLimit, setUsageLimit] = React.useState("");
  const [perUserLimit, setPerUserLimit] = React.useState("");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Search filter
  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Edit action
  const handleEdit = (coupon: ICoupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setName(coupon.name);
    setDescription(coupon.description ?? "");
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMinOrderAmount(coupon.minOrderAmount?.toString() ?? "");
    setMaxDiscountAmount(coupon.maxDiscountAmount?.toString() ?? "");
    setUsageLimit(coupon.usageLimit?.toString() ?? "");
    setPerUserLimit(coupon.perUserLimit?.toString() ?? "");
    setStartsAt(formatInputDate(coupon.startsAt));
    setEndsAt(coupon.endsAt ? formatInputDate(coupon.endsAt) : "");
    setIsActive(coupon.isActive);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Create action
  const handleCreateOpen = () => {
    setEditingCoupon(null);
    setCode("");
    setName("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderAmount("");
    setMaxDiscountAmount("");
    setUsageLimit("");
    setPerUserLimit("");
    setStartsAt(formatInputDate(new Date()));
    setEndsAt("");
    setIsActive(true);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Status toggle
  const handleStatusToggle = async (coupon: ICoupon, checked: boolean) => {
    try {
      await toggleCouponStatus({ id: coupon.id, isActive: checked }).unwrap();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code.trim()) {
      setErrorMsg("Coupon code is required.");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Coupon name is required.");
      return;
    }
    if (!discountValue || Number(discountValue) <= 0) {
      setErrorMsg("Discount value must be greater than 0.");
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || null,
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      perUserLimit: perUserLimit ? parseInt(perUserLimit) : null,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      isActive,
    };

    try {
      if (editingCoupon) {
        const response = await updateCoupon({
          id: editingCoupon.id,
          body: payload as any,
        }).unwrap();
        if (response.success) {
          setSuccessMsg("Coupon updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        }
      } else {
        const response = await createCoupon(payload as any).unwrap();
        if (response.success) {
          setSuccessMsg("Coupon created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        }
      }
    } catch (err: any) {
      const message = err?.data?.error
        ? err.data.error.join(", ")
        : err?.data?.message || "Something went wrong.";
      setErrorMsg(message);
    }
  };

  // Delete Action
  const handleDeleteTrigger = (coupon: ICoupon) => {
    setCouponToDelete(coupon);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteCoupon(couponToDelete.id).unwrap();
      if (response.success) {
        setIsDeleteOpen(false);
        setCouponToDelete(null);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to delete coupon.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-serif text-stone-950 dark:text-stone-50">
            Coupons Management
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Create and configure unique discount promo codes to incentivize sales or run specialized marketing campaigns.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-amber-600 dark:bg-amber-500 dark:text-stone-950 hover:text-white dark:hover:bg-amber-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search coupon code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredCoupons.length} coupons
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Fetching coupons...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve coupons list. Verify the server is running.
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
                  <TableHead className="w-[120px]">Promo Code</TableHead>
                  <TableHead>Coupon Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Redemptions</TableHead>
                  <TableHead>Active Window</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-stone-400">
                      No coupons found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((c) => {
                    const starts = formatDate(c.startsAt);
                    const ends = c.endsAt ? formatDate(c.endsAt) : "Lifetime";
                    return (
                      <TableRow
                        key={c.id}
                        className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell className="font-mono font-bold text-stone-950 dark:text-stone-50">
                          <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded text-xs">
                            {c.code}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-stone-900 dark:text-stone-100">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {c.discountType === "PERCENTAGE"
                            ? `${c.discountValue}% Off`
                            : `₹${c.discountValue} Off`}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400">
                          {c.redeemedCount} / {c.usageLimit ?? "∞"}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500 dark:text-stone-400">
                          {starts} - {ends}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={c.isActive}
                            onCheckedChange={(checked) => handleStatusToggle(c, checked)}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(c)}
                            className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                          >
                            <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTrigger(c)}
                            className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
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

      {/* FORM DIALOG */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-stone-950 dark:text-stone-50">
              {editingCoupon ? "Edit Coupon Details" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Configure promo codes, select discount structures, and set validation limits.
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

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Promo Code (Uppercase)
                  </label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    required
                    disabled={!!editingCoupon}
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Coupon Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Solstice Clearance"
                    required
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about coupon use..."
                    className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Discount Type
                    </label>
                    <Select
                      value={discountType}
                      onValueChange={(val: any) => setDiscountType(val)}
                    >
                      <SelectTrigger className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                        <SelectItem value="FIXED_AMOUNT">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Discount Value
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={discountType === "PERCENTAGE" ? "25" : "50"}
                        required
                        min="1"
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500 pl-7"
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-stone-400 font-bold">
                        {discountType === "PERCENTAGE" ? "%" : "₹"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Limits & Dates */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Min Order Amount
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                        placeholder="100"
                        min="0"
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-7"
                      />
                      <IndianRupee className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Max Discount Limit
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={maxDiscountAmount}
                        onChange={(e) => setMaxDiscountAmount(e.target.value)}
                        placeholder="250"
                        min="0"
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-7"
                      />
                      <IndianRupee className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Total Usage Limit
                    </label>
                    <Input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="e.g. 500 (total times)"
                      min="1"
                      className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Limit Per Customer
                    </label>
                    <Input
                      type="number"
                      value={perUserLimit}
                      onChange={(e) => setPerUserLimit(e.target.value)}
                      placeholder="e.g. 1"
                      min="1"
                      className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Starts At
                    </label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                        required
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-8"
                      />
                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Ends At (Optional)
                    </label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={endsAt}
                        onChange={(e) => setEndsAt(e.target.value)}
                        className="bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-xs focus:border-amber-500 pl-8"
                      />
                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-amber-500"
                  />
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Enable coupon immediately upon creation
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-stone-950 hover:bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-600 text-xs px-6 font-bold"
              >
                {(isCreating || isUpdating) && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                {editingCoupon ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-serif font-bold text-stone-950 dark:text-stone-50">
              Confirm Coupon Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action is permanent. You are deleting coupon code{" "}
              <span className="font-semibold font-mono text-amber-600">{couponToDelete?.code}</span>.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="pt-2 text-xs text-stone-500 leading-relaxed">
            Note: Deleting this coupon will not break orders where it has already been redeemed, but users will no longer be able to validate it during checkout sessions.
          </div>

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
              Delete Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
