"use client";

import * as React from "react";
import {
  useGetAdminAllReviewsQuery,
  useDeleteReviewMutation,
} from "@/services/api/reviews/reviews-api";
import { Review } from "@/services/api/reviews/reviews-api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  Mail,
  User as UserIcon,
  Package,
} from "lucide-react";
import Image from "next/image";

export default function ReviewsModerationPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Query API
  const { data, isLoading, isError, refetch } = useGetAdminAllReviewsQuery({
    page,
    limit,
    search: debouncedSearch,
    rating,
  });

  const reviews = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalReviews = data?.data?.total ?? 0;

  // Mutation API
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Selected review states
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Action handlers
  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  };

  const handleDeleteTrigger = (review: Review) => {
    setErrorMsg("");
    setSuccessMsg("");
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await deleteReview(selectedReview.id).unwrap();

      if (response.success) {
        setSuccessMsg("Review deleted successfully.");
        setTimeout(() => {
          setIsDeleteOpen(false);
          setSelectedReview(null);
        }, 800);
      } else {
        setErrorMsg(response.message || "Failed to delete review.");
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to delete review. Try again.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Reviews Moderation
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Audit customer product reviews, check feedback star ratings, and delete inappropriate content or spam.
          </p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search comment, product, or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
              />
            </div>

            {/* Rating Filter Selector */}
            <Select
              value={rating === undefined ? "all" : String(rating)}
              onValueChange={(val) => {
                setRating(val === "all" ? undefined : Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm h-10">
                <SelectValue placeholder="Rating Filter" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-stone-400 self-start sm:self-auto">
            Showing {totalReviews} product reviews
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Loading product reviews...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve review listings. Verify your backend service is running and Prisma connection is active.
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
                  <TableHead className="font-semibold text-foreground">Linked Product</TableHead>
                  <TableHead className="font-semibold text-foreground">Reviewer</TableHead>
                  <TableHead className="font-semibold text-foreground">Rating</TableHead>
                  <TableHead className="font-semibold text-foreground">Comment Summary</TableHead>
                  <TableHead className="font-semibold text-foreground">Date</TableHead>
                  <TableHead className="w-[100px] text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-stone-450 italic text-stone-400">
                      No customer reviews found matching filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((rev) => {
                    const productImg =
                      rev.product?.images && rev.product.images.length > 0
                        ? rev.product.images[0].media.url
                        : "/placeholder-item.jpg";

                    return (
                      <TableRow
                        key={rev.id}
                        className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        {/* Product info */}
                        <TableCell>
                          <div className="flex items-center gap-3 py-1">
                            <div className="relative h-10 w-10 overflow-hidden border border-stone-100 bg-stone-50">
                              <Image
                                src={productImg}
                                alt={rev.product?.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-stone-900 dark:text-stone-100 text-xs line-clamp-1">
                                {rev.product?.name || "Deleted Product"}
                              </span>
                              <span className="font-mono text-[9px] text-stone-400">
                                {rev.product?.slug || "-"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Reviewer info */}
                        <TableCell>
                          <div className="flex flex-col gap-0.5 py-1">
                            <span className="font-medium text-stone-900 dark:text-stone-100 text-xs flex items-center gap-1">
                              <UserIcon className="h-3 w-3 text-stone-400" />
                              {rev.user?.name}
                            </span>
                            {rev.user?.email && (
                              <span className="font-mono text-[10px] text-stone-400 flex items-center gap-1">
                                <Mail className="h-3 w-3 text-stone-400" />
                                {rev.user?.email}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Rating stars */}
                        <TableCell>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < rev.rating ? "fill-amber-500 text-amber-500" : "text-stone-200 dark:text-stone-800"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>

                        {/* Comment text */}
                        <TableCell className="max-w-[250px]">
                          <p className="text-stone-700 dark:text-stone-300 text-xs truncate">
                            {rev.comment}
                          </p>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-stone-600 dark:text-stone-400 font-light">
                          {new Date(rev.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>

                        {/* Action buttons */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(rev)}
                              className="text-xs h-8 text-stone-600 dark:text-stone-400"
                            >
                              Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTrigger(rev)}
                              className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-955/10"
                              title="Delete Review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* DETAILS VIEW DIALOG */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Review Details
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Complete metadata and feedback text left by the customer.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 pt-4 text-xs text-stone-600 dark:text-stone-300">
              {/* Product Subcard */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-850">
                <Package className="h-4 w-4 text-stone-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Product</p>
                  <p className="font-semibold text-stone-900 dark:text-white line-clamp-1">{selectedReview.product?.name || "Deleted Product"}</p>
                </div>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Reviewer</p>
                  <p className="font-semibold text-stone-900 dark:text-white">{selectedReview.user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Email</p>
                  <p className="font-mono text-stone-900 dark:text-white truncate">{selectedReview.user.email || "-"}</p>
                </div>
              </div>

              {/* Rating and date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Rating</p>
                  <div className="flex text-amber-500 pt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < selectedReview.rating ? "fill-amber-500 text-amber-500" : "text-stone-200 dark:text-stone-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Submitted Date</p>
                  <p className="font-semibold text-stone-900 dark:text-white pt-0.5">
                    {new Date(selectedReview.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Comment Content */}
              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Customer Comment</p>
                <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-250 dark:border-stone-850 rounded font-sans text-stone-800 dark:text-stone-200 leading-relaxed max-h-40 overflow-y-auto">
                  {selectedReview.comment}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-900">
            <Button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              className="text-xs bg-stone-950 hover:bg-stone-900 text-white rounded-none px-6"
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Remove Review Record
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Confirm deleting this product review from the store index.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50/50 dark:bg-red-955/10 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex gap-2 rounded">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-250 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs rounded">
              <p>{successMsg}</p>
            </div>
          )}

          {selectedReview && (
            <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <p>
                Reviewer:{" "}
                <span className="font-bold text-stone-900 dark:text-white">
                  {selectedReview.user.name}
                </span>
              </p>
              <p>
                Rating:{" "}
                <span className="font-semibold text-amber-600">{selectedReview.rating} Stars</span>
              </p>
              <div className="bg-stone-50 dark:bg-stone-900 p-3 border rounded text-[11px] text-stone-550 italic leading-snug line-clamp-3">
                &quot;{selectedReview.comment}&quot;
              </div>
              <p className="text-[10px] text-stone-400 leading-normal">
                Altering this database item completely removes it from storefront product review sections. This action cannot be undone.
              </p>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-900 gap-2">
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
              className="bg-red-655 bg-red-600 hover:bg-red-750 hover:bg-red-700 text-white text-xs px-6 font-bold"
            >
              {isDeleting && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

