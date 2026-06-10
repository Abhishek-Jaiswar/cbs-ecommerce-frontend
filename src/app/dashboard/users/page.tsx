"use client";

import * as React from "react";
import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/services/api/auth/auth-api";
import { User } from "@/services/api/auth/auth-api.types";
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
import { useAppSelector } from "@/store/hooks";
import {
  Pencil,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Mail,
  User as UserIcon,
} from "lucide-react";

export default function CustomersPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  // Get current logged-in user to prevent self-role-toggle
  const currentUser = useAppSelector((state) => state.auth.user);

  // Queries
  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    page,
    limit,
  });

  const users = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  // Mutations
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // State for user details dialog
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const { data: userDetailsRes, isLoading: isDetailsLoading } = useGetUserByIdQuery(
    selectedUserId ?? "",
    { skip: !selectedUserId }
  );
  const selectedUser = userDetailsRes?.data;

  // Dialog State
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isRoleOpen, setIsRoleOpen] = React.useState(false);
  const [userToToggle, setUserToToggle] = React.useState<User | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Search filter local list items
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Action: Open details
  const handleViewDetails = (user: User) => {
    setSelectedUserId(user.id);
    setIsDetailsOpen(true);
  };

  // Action: Toggle Role
  const handleToggleRoleTrigger = (user: User) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (user.id === currentUser?.id) {
      alert("Safety Lock: You cannot update your own administrative role.");
      return;
    }
    setUserToToggle(user);
    setIsRoleOpen(true);
  };

  const handleToggleRoleConfirm = async () => {
    if (!userToToggle) return;
    setErrorMsg("");
    setSuccessMsg("");

    const nextRole = userToToggle.role === "ADMIN" ? "USER" : "ADMIN";

    try {
      const response = await updateUserRole({
        id: userToToggle.id,
        role: nextRole,
      }).unwrap();

      if (response.success) {
        setSuccessMsg(`Successfully toggled role to ${nextRole}`);
        setTimeout(() => {
          setIsRoleOpen(false);
          setUserToToggle(null);
        }, 800);
      } else {
        setErrorMsg(response.message || "Failed to toggle role.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(errorData?.data?.message || "Failed to update user role.");
    }
  };

  // Action: Delete User
  const handleDeleteTrigger = (user: User) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (user.id === currentUser?.id) {
      alert("Safety Lock: You cannot delete your own active administrative session.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await deleteUser(userToDelete.id).unwrap();

      if (response.success) {
        setSuccessMsg("Customer account deleted successfully.");
        setTimeout(() => {
          setIsDeleteOpen(false);
          setUserToDelete(null);
        }, 800);
      } else {
        setErrorMsg(response.message || "Failed to delete user.");
      }
    } catch (err: unknown) {
      const errorData = err as { data?: { message?: string } };
      setErrorMsg(errorData?.data?.message || "Failed to delete customer record.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-stone-50/50 dark:bg-stone-900/50 min-h-screen text-stone-900 dark:text-stone-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-950 dark:text-stone-50">
            Customers Directory
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
            Audit customer accounts, manage roles, and review shipping and billing address records.
          </p>
        </div>
      </div>

      {/* Controls & Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search customers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-sm focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-stone-400">
            Showing {filteredUsers.length} active customer profiles
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-xs text-stone-400">Loading user directory...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-red-200 bg-rose-50/50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <h3 className="font-semibold text-stone-950">Connection Error</h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Could not retrieve customer list. Verify your API server is running and database migrations have applied.
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
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Security Role</TableHead>
                  <TableHead>Email Verification</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-stone-400">
                      No customer accounts found matching search filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow
                      key={u.id}
                      className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                    >
                      <TableCell className="font-semibold text-stone-900 dark:text-stone-50">
                        {u.name} {u.id === currentUser?.id && "(You)"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-stone-500 dark:text-stone-400">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        {u.role === "ADMIN" ? (
                          <Badge className="bg-amber-500/10 border-amber-500/30 border text-amber-600 dark:text-amber-400 font-semibold text-[10px] py-0.5 uppercase tracking-wide">
                            Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-stone-100 border text-stone-600 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800 text-[10px] py-0.5 uppercase tracking-wide">
                            Customer
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.emailVerified ? (
                          <Badge className="bg-emerald-500/10 border-emerald-500/25 border text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold py-0.5">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 border-amber-500/25 border text-amber-600 dark:text-amber-400 text-[10px] uppercase font-bold py-0.5">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-stone-500">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          onClick={() => handleViewDetails(u)}
                          className="h-8 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRoleTrigger(u)}
                          disabled={u.id === currentUser?.id}
                          className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Toggle Admin/User Role"
                        >
                          <Pencil className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTrigger(u)}
                          disabled={u.id === currentUser?.id}
                          className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 disabled:opacity-50"
                          title="Delete User"
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

      {/* CUSTOMER DETAILS & ADDRESSES DIALOG */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-amber-500" />
              Customer Profile Audit
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Complete metadata audit for this customer registration, including all shipping addresses.
            </DialogDescription>
          </DialogHeader>

          {isDetailsLoading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              <p className="text-xs text-stone-400">Fetching customer details...</p>
            </div>
          ) : !selectedUser ? (
            <div className="p-4 text-center text-xs text-stone-400">
              Could not retrieve customer details.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: General Info */}
              <div className="space-y-4 border-r border-stone-100 dark:border-stone-850 pr-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Account details
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase">Full name</p>
                      <p className="font-semibold text-stone-900 dark:text-stone-55">{selectedUser.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase">Email Address</p>
                      <p className="font-mono text-stone-700 dark:text-stone-300">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-stone-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase">Member Since</p>
                      <p className="text-stone-700 dark:text-stone-300">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <div>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase mb-1">Role</p>
                      {selectedUser.role === "ADMIN" ? (
                        <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/25 text-[10px] uppercase font-bold">
                          Administrator
                        </Badge>
                      ) : (
                        <Badge className="bg-stone-100 border text-stone-600 text-[10px] uppercase font-bold">
                          Customer
                        </Badge>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] text-stone-400 font-semibold uppercase mb-1">Verification</p>
                      {selectedUser.emailVerified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 text-[10px] uppercase font-bold">
                          Verified Email
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/25 text-[10px] uppercase font-bold">
                          Pending OTP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Address Records */}
              <div className="space-y-3 flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  Address registry ({selectedUser.addresses?.length ?? 0})
                </h3>

                <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1">
                  {!selectedUser.addresses || selectedUser.addresses.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-stone-200 dark:border-stone-850 rounded p-6 text-center text-xs text-stone-400">
                      No registered shipping or billing address records found.
                    </div>
                  ) : (
                    selectedUser.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-3 border border-stone-100 dark:border-stone-850 rounded bg-stone-50/50 dark:bg-stone-900/30 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {address.fullname}
                          </p>
                          <div className="flex gap-1">
                            {address.isDefaultShipping && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] uppercase py-0 px-1">
                                Default Ship
                              </Badge>
                            )}
                            {address.isDefaultBilling && (
                              <Badge className="bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] uppercase py-0 px-1">
                                Default Bill
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-tight">
                          {address.addressLine1}
                          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                          {address.landmark ? ` (Landmark: ${address.landmark})` : ""}
                        </p>
                        <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                          {address.city}, {address.state} - {address.postalCode}, {address.country}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono pt-1">
                          Phone: {address.phoneNumber}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
              className="text-xs"
            >
              Close Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ROLE CHANGE CONFIRM DIALOG */}
      <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Adjust Account Role
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              Confirm role adjustments for security authorizations.
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

          {userToToggle && (
            <div className="pt-2 text-xs text-stone-700 dark:text-stone-300 space-y-2">
              <p>
                You are altering the role of{" "}
                <span className="font-bold text-stone-900 dark:text-white">
                  {userToToggle.name}
                </span>{" "}
                (<i>{userToToggle.email}</i>).
              </p>
              <p className="flex items-center gap-2 font-semibold">
                Current Role:{" "}
                <span className="capitalize">{userToToggle.role.toLowerCase()}</span>
                <span>➔</span>
                Target Role:{" "}
                <span className="capitalize text-amber-600 dark:text-amber-400">
                  {userToToggle.role === "ADMIN" ? "User" : "Admin"}
                </span>
              </p>
              <p className="text-[10px] text-stone-400">
                Warning: Promoted admins gain full write privileges to catalog, products, user sessions, and database structures.
              </p>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-stone-100 dark:border-stone-850 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRoleOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isUpdatingRole}
              onClick={handleToggleRoleConfirm}
              className="bg-stone-950 hover:bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-600 text-xs px-6 font-bold"
            >
              {isUpdatingRole && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
              Confirm Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-950 dark:text-stone-50">
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400">
              This action is permanent and destructive.
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

          {userToDelete && (
            <div className="pt-2 text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <p>
                Deleting account for:{" "}
                <span className="font-bold text-stone-900 dark:text-white">
                  {userToDelete.name}
                </span>{" "}
                (<i>{userToDelete.email}</i>).
              </p>
              <p className="text-[10px] text-red-500 font-semibold leading-relaxed">
                Warning: Deletion cascade removes all linked carts, wishlist assets, and addresses from the database.
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
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
