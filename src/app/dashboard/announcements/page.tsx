"use client";

import * as React from "react";
import {
  useGetAdminAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  IAnnouncement,
} from "@/services/api/announcements/announcements-api";
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
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AnnouncementsPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useGetAdminAnnouncementsQuery({
    page,
    limit,
  });

  const announcements = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingAnn, setEditingAnn] = React.useState<IAnnouncement | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [annToDelete, setAnnToDelete] = React.useState<IAnnouncement | null>(null);

  // Form States
  const [text, setText] = React.useState("");
  const [link, setLink] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Search filter local display items
  const filteredAnnouncements = announcements.filter((ann) =>
    ann.text.toLowerCase().includes(search.toLowerCase())
  );

  // Handle Edit Action
  const handleEdit = (ann: IAnnouncement) => {
    setEditingAnn(ann);
    setText(ann.text);
    setLink(ann.link ?? "");
    setIsActive(ann.isActive);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Handle Create Open
  const handleCreateOpen = () => {
    setEditingAnn(null);
    setText("");
    setLink("");
    setIsActive(true);
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  // Toggle Active switch in table directly
  const handleToggleActive = async (ann: IAnnouncement) => {
    try {
      await updateAnnouncement({
        id: ann.id,
        body: { isActive: !ann.isActive },
      }).unwrap();
    } catch (err: any) {
      console.error("Failed to toggle announcement status", err);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!text.trim()) {
      setErrorMsg("Announcement text is required.");
      return;
    }

    const body = {
      text: text.trim(),
      link: link.trim() || null,
      isActive,
    };

    try {
      if (editingAnn) {
        const response = await updateAnnouncement({
          id: editingAnn.id,
          body,
        }).unwrap();
        
        if (response.success) {
          setSuccessMsg("Announcement updated successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to update announcement.");
        }
      } else {
        const response = await createAnnouncement(body).unwrap();
        if (response.success) {
          setSuccessMsg("Announcement created successfully.");
          setTimeout(() => setIsFormOpen(false), 800);
        } else {
          setErrorMsg(response.message || "Failed to create announcement.");
        }
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string; error?: string[] } };
      const message = errorData?.data?.error
        ? errorData.data.error.join(", ")
        : errorData?.data?.message || "Something went wrong. Please check fields.";
      setErrorMsg(message);
    }
  };

  // Delete Action
  const handleDeleteTrigger = (ann: IAnnouncement) => {
    setAnnToDelete(ann);
    setErrorMsg("");
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!annToDelete) return;
    setErrorMsg("");

    try {
      const response = await deleteAnnouncement(annToDelete.id).unwrap();
      if (response.success) {
        setIsDeleteOpen(false);
        setAnnToDelete(null);
      } else {
        setErrorMsg(response.message || "Failed to delete announcement.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(errorData?.data?.message || "Could not delete announcement.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100 font-[var(--font-corano)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Top Bar Announcements
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Manage active headlines, banners, offers, and news alerts that scroll infinitely in the top header section of your store.
          </p>
        </div>
        <Button
          onClick={handleCreateOpen}
          className="self-start sm:self-auto shadow-md gap-2 bg-stone-950 hover:bg-[#c29958] text-white transition-colors dark:bg-[#c29958] dark:hover:bg-[#b0884b] dark:text-stone-950"
        >
          <Plus className="h-4 w-4" />
          Add Announcement
        </Button>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-[#c29958]"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredAnnouncements.length} announcements
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-[#c29958]" />
            <p className="text-xs text-stone-400 font-medium">Fetching announcements database...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm font-semibold">Failed to load announcements data.</p>
            <Button onClick={() => refetch()} variant="outline" className="text-xs">
              Retry Connection
            </Button>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-3 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <AlertCircle className="h-8 w-8 text-stone-300 dark:text-stone-700" />
            <p className="text-sm font-bold text-stone-400 dark:text-stone-500">No announcements match search query</p>
            <Button size="sm" onClick={handleCreateOpen} variant="outline">
              Create First Announcement
            </Button>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-50 dark:bg-stone-900/50">
                <TableRow>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead>Headline Text</TableHead>
                  <TableHead>Target Link</TableHead>
                  <TableHead className="w-[120px]">Created</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((ann) => (
                  <TableRow key={ann.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30">
                    <TableCell>
                      <Switch
                        checked={ann.isActive}
                        onCheckedChange={() => handleToggleActive(ann)}
                        aria-label="Toggle announcement status"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">
                      {ann.text}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-stone-500">
                      {ann.link ? (
                        <a
                          href={ann.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#c29958] underline text-xs"
                        >
                          {ann.link}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs italic text-stone-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-stone-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ann)}
                          className="h-8 w-8 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(ann)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-xs text-stone-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] font-[var(--font-corano)] rounded-none">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-stone-950 dark:text-stone-50">
                {editingAnn ? "Edit Announcement" : "Add New Announcement"}
              </DialogTitle>
              <DialogDescription className="text-stone-500">
                Create a headline message to show in the scrolling marquee at the very top of the website.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-600 border border-green-200 text-xs font-bold">
                  {successMsg}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="text" className="text-sm font-bold">Headline Text *</label>
                <Input
                  id="text"
                  placeholder="e.g. ✨ Summer Special Offer: 20% off all Diamond Jewelry! Use code DIAMOND20 ✨"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="rounded-none border-stone-200 dark:border-stone-800 focus:border-[#c29958]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="link" className="text-sm font-bold">Destination URL Link (Optional)</label>
                <Input
                  id="link"
                  placeholder="e.g. /shop?category=diamond-jewelry or https://google.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="rounded-none border-stone-200 dark:border-stone-800 focus:border-[#c29958]"
                />
                <p className="text-[10px] text-stone-400">
                  Allows visitors to click the scrolling announcement to redirect to a specific collections page. Can be relative (e.g. /shop) or absolute.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <label htmlFor="isActive" className="text-sm font-bold cursor-pointer">
                  Activate announcement immediately
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isCreating || isUpdating}
                className="rounded-none border-stone-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-none bg-stone-950 text-white hover:bg-[#c29958] transition-colors dark:bg-[#c29958] dark:hover:bg-[#b0884b] dark:text-stone-950 gap-2"
              >
                {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingAnn ? "Save Changes" : "Create Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] font-[var(--font-corano)] rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Announcement</DialogTitle>
            <DialogDescription className="text-stone-500">
              Are you sure you want to delete this announcement headline? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="py-2 text-sm text-stone-600 dark:text-stone-400">
            Deleting: <strong className="text-stone-950 dark:text-stone-50">{annToDelete?.text}</strong>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="rounded-none border-stone-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-none bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
