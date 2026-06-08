"use client";

import React, { useState } from "react";
import {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  type Address,
} from "@/services/api/addresses/addresses-api";
import { Loader2, MapPin, Plus, Trash2, Edit2, ShieldAlert, X, Check } from "lucide-react";

const SavedAddresses: React.FC = () => {
  const { data: addressesRes, isLoading, isError, refetch } = useGetMyAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState({
    fullname: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addresses = addressesRes?.data ?? [];

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormValues({
      fullname: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setErrors({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddressId(addr.id);
    setFormValues({
      fullname: addr.fullname || "",
      phoneNumber: addr.phoneNumber || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
      isDefaultShipping: addr.isDefaultShipping || false,
      isDefaultBilling: addr.isDefaultBilling || false,
    });
    setErrors({});
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formValues.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formValues.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (formValues.phoneNumber.replace(/\D/g, "").length < 10) {
      newErrors.phoneNumber = "Valid 10-digit phone number is required";
    }
    if (!formValues.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formValues.city.trim()) newErrors.city = "City is required";
    if (!formValues.state.trim()) newErrors.state = "State is required";

    const cleanPin = formValues.postalCode.trim();
    if (!cleanPin) {
      newErrors.postalCode = "Postal code is required";
    } else if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      newErrors.postalCode = "Postal code must be exactly 6 digits";
    }
    if (!formValues.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const isValid = validate();
    if (!isValid) return;

    try {
      if (editingAddressId) {
        const res = await updateAddress({ id: editingAddressId, body: formValues }).unwrap();
        if (res.success) {
          setIsModalOpen(false);
        } else {
          setFormError(res.message || "Failed to update address.");
        }
      } else {
        const res = await createAddress(formValues).unwrap();
        if (res.success) {
          setIsModalOpen(false);
        } else {
          setFormError(res.message || "Failed to create address.");
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setFormError(error?.data?.message || "An error occurred while saving the address.");
    }
  };

  const handleDeleteClick = (addrId: string) => {
    setDeletingAddressId(addrId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddressId) return;

    try {
      const res = await deleteAddress(deletingAddressId).unwrap();
      if (res.success) {
        setDeletingAddressId(null);
      }
    } catch (err: unknown) {
      console.error("Delete address failed:", err);
      alert("Failed to delete address. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
          <p className="text-xs text-stone-500 italic">Retrieving shipping addresses...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center space-y-4 max-w-sm mx-auto bg-white border border-stone-200 p-8 shadow-sm">
        <p className="text-xs text-stone-500 leading-relaxed">
          There was an issue fetching your saved addresses. Please check your connection or reload the page.
        </p>
        <button
          onClick={refetch}
          className="border border-stone-200 hover:border-stone-950 font-bold px-4 py-2 text-[10px] uppercase tracking-wider transition-colors duration-200"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-serif text-stone-900 font-medium">Saved Addresses</h2>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            Manage your default billing and shipping address options.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-2.5 px-4 text-[10px] uppercase tracking-widest transition-all duration-200 flex items-center gap-1.5"
        >
          <Plus size={14} />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white border border-stone-200 p-10 text-center space-y-5 max-w-md mx-auto shadow-sm">
          <div className="h-12 w-12 bg-stone-50 flex items-center justify-center text-stone-400 mx-auto border border-stone-100">
            <MapPin size={20} />
          </div>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            You do not have any saved delivery addresses yet. Add one to expedite checkout.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="w-full bg-stone-950 text-white font-bold py-3 text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-stone-950 transition-colors duration-200"
          >
            Add Shipping Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-stone-200 p-5 shadow-sm space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between pr-8">
                  <h4 className="text-xs font-bold text-stone-800 font-sans flex items-center gap-1">
                    <MapPin size={12} className="text-stone-400" />
                    {addr.fullname}
                  </h4>
                  
                  <div className="flex flex-col gap-1.5 items-end">
                    {addr.isDefaultShipping && (
                      <span className="bg-stone-100 text-stone-800 font-bold uppercase text-[8px] tracking-wider px-1.5 py-0.2 border border-stone-200">
                        Default Shipping
                      </span>
                    )}
                    {addr.isDefaultBilling && (
                      <span className="bg-stone-100 text-stone-800 font-bold uppercase text-[8px] tracking-wider px-1.5 py-0.2 border border-stone-200">
                        Default Billing
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 leading-relaxed font-sans pt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  {addr.landmark ? `, Near ${addr.landmark}` : ""}
                  <br />
                  {addr.city}, {addr.state} - {addr.postalCode}
                  <br />
                  {addr.country}
                </p>
                <p className="text-[10px] text-stone-400 font-medium">Phone: {addr.phoneNumber}</p>
              </div>

              <div className="border-t border-stone-100 pt-3 flex gap-3 justify-end">
                <button
                  onClick={() => handleOpenEditModal(addr)}
                  className="text-stone-500 hover:text-stone-950 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                  title="Edit address"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(addr.id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                  title="Delete address"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT ADDRESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-stone-200 shadow-md p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
              title="Close modal"
              type="button"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3 mb-6">
              {editingAddressId ? "Edit Saved Address" : "Add New Address"}
            </h3>

            {formError && (
              <div className="p-3 text-[11px] font-semibold mb-6 bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-1">
                <span className="shrink-0">⚠️</span>
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.fullname}
                    onChange={(e) => handleFieldChange("fullname", e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                      errors.fullname ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                    }`}
                  />
                  {errors.fullname && (
                    <span className="text-[9px] text-rose-600 font-medium">{errors.fullname}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formValues.phoneNumber}
                    onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                    placeholder="e.g. 9876543210"
                    className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                      errors.phoneNumber ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <span className="text-[9px] text-rose-600 font-medium">{errors.phoneNumber}</span>
                  )}
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Address Line 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formValues.addressLine1}
                  onChange={(e) => handleFieldChange("addressLine1", e.target.value)}
                  placeholder="Flat, House no., Building, Company, Apartment"
                  className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                    errors.addressLine1 ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                  }`}
                />
                {errors.addressLine1 && (
                  <span className="text-[9px] text-rose-600 font-medium">{errors.addressLine1}</span>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formValues.addressLine2}
                  onChange={(e) => handleFieldChange("addressLine2", e.target.value)}
                  placeholder="Area, Street, Sector, Village"
                  className="w-full border border-stone-200 px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white focus:border-stone-950 transition-all"
                />
              </div>

              {/* Landmark */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formValues.landmark}
                  onChange={(e) => handleFieldChange("landmark", e.target.value)}
                  placeholder="e.g. Near Apollo Hospital"
                  className="w-full border border-stone-200 px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white focus:border-stone-950 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    placeholder="e.g. Mumbai"
                    className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                      errors.city ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                    }`}
                  />
                  {errors.city && (
                    <span className="text-[9px] text-rose-600 font-medium">{errors.city}</span>
                  )}
                </div>

                {/* State */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                      errors.state ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                    }`}
                  />
                  {errors.state && (
                    <span className="text-[9px] text-rose-600 font-medium">{errors.state}</span>
                  )}
                </div>

                {/* Postal Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Postal Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.postalCode}
                    onChange={(e) => handleFieldChange("postalCode", e.target.value)}
                    placeholder="6-digit code"
                    maxLength={6}
                    className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                      errors.postalCode ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                    }`}
                  />
                  {errors.postalCode && (
                    <span className="text-[9px] text-rose-600 font-medium">{errors.postalCode}</span>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Country <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formValues.country}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  placeholder="e.g. India"
                  className={`w-full border px-4 py-2.5 rounded-none outline-none text-xs text-stone-800 bg-stone-50/50 focus:bg-white transition-all ${
                    errors.country ? "border-rose-400 focus:border-rose-500" : "border-stone-200 focus:border-stone-950"
                  }`}
                />
                {errors.country && (
                  <span className="text-[9px] text-rose-600 font-medium">{errors.country}</span>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 pt-2 text-xs">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formValues.isDefaultShipping}
                    onChange={(e) => handleFieldChange("isDefaultShipping", e.target.checked)}
                    className="accent-stone-950 h-3.5 w-3.5 border-stone-200"
                  />
                  Set as default shipping address
                </label>
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formValues.isDefaultBilling}
                    onChange={(e) => handleFieldChange("isDefaultBilling", e.target.checked)}
                    className="accent-stone-950 h-3.5 w-3.5 border-stone-200"
                  />
                  Set as default billing address
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-stone-200 hover:border-stone-950 font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 bg-white text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 text-white font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deletingAddressId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white border border-stone-200 shadow-md p-6 relative">
            <button
              onClick={() => setDeletingAddressId(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
              title="Close modal"
              type="button"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-1.5 text-rose-700">
              <ShieldAlert size={16} />
              Delete Address
            </h3>

            <p className="text-xs text-stone-500 leading-relaxed mb-6 font-light">
              Are you sure you want to delete this saved address? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingAddressId(null)}
                disabled={isDeleting}
                className="flex-1 border border-stone-200 hover:border-stone-950 font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 bg-white text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Address"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
