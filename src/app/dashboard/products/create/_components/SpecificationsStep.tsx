"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCreateSpecificationMutation,
  useDeleteSpecificationMutation,
  useUpdateStatusMutation,
} from "@/services/api/products/products-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Lock } from "lucide-react";

interface SpecificationsStepProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
  activeSection: 1 | 2 | 3 | 4 | 5;
}

export const SpecificationsStep: React.FC<SpecificationsStepProps> = ({
  productId,
  product,
  refetchProduct,
  activeSection,
}) => {
  // Input states
  const [newSpecKey, setNewSpecKey] = React.useState("");
  const [newSpecValue, setNewSpecValue] = React.useState("");

  const router = useRouter();

  // Mutations
  const [createSpec, { isLoading: isCreatingSpec }] = useCreateSpecificationMutation();
  const [deleteSpec] = useDeleteSpecificationMutation();
  const [updateStatus, { isLoading: isPublishing }] = useUpdateStatusMutation();

  const handlePublish = async () => {
    try {
      await updateStatus({ id: productId, status: "ACTIVE" }).unwrap();
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Failed to publish product:", err);
    }
  };

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !newSpecKey || !newSpecValue) return;

    try {
      await createSpec({
        productId,
        body: [{ key: newSpecKey, value: newSpecValue }],
      }).unwrap();
      setNewSpecKey("");
      setNewSpecValue("");
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSpec = async (specId: string) => {
    if (!productId) return;
    try {
      await deleteSpec({ productId, specificationId: specId }).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className={`border-border shadow-sm transition-all duration-300 ${!productId || activeSection < 5 ? "opacity-40 select-none pointer-events-none" : "bg-card"}`}>
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${productId && activeSection === 5 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              5
            </div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              5. Specifications
              {(activeSection < 5 || !productId) && <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">Add specifications parameters (e.g. Metal Carat, Gemstone Weight, Dimensions).</CardDescription>
        </div>
      </CardHeader>

      {productId && activeSection === 5 && (
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form column */}
            <Card className="bg-background border-border/60">
              <CardHeader className="pb-3 p-4">
                <CardTitle className="text-sm font-bold">Add Specification</CardTitle>
                <CardDescription className="text-[11px]">Define specification attributes displayed on listing details.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAddSpec}>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground">Parameter Key</label>
                    <Input
                      placeholder="e.g. Carat Weight, Metal"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      className="h-8 text-xs bg-background border-input"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground">Parameter Value</label>
                    <Input
                      placeholder="e.g. 18K Yellow Gold, 1.2ct"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      className="h-8 text-xs bg-background border-input"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-4 flex justify-end">
                  <Button type="submit" size="sm" className="h-8 gap-1" disabled={isCreatingSpec}>
                    {isCreatingSpec ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" /> Add Attribute
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Specs list column */}
            <div className="lg:col-span-2">
              <Card className="bg-background border-border/60 h-full">
                <CardHeader className="pb-3 p-4">
                  <CardTitle className="text-sm font-bold">Specifications Added</CardTitle>
                  <CardDescription className="text-[11px]">Dynamic attributes configured in the details table.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t border-border/60">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse text-left">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                          <th className="p-3">Attribute Key</th>
                          <th className="p-3">Value</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product?.specification && product.specification.length > 0 ? (
                          product.specification.map((spec: any) => (
                            <tr key={spec.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-semibold text-foreground">{spec.key}</td>
                              <td className="p-3 text-muted-foreground">{spec.value}</td>
                              <td className="p-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                  onClick={() => handleDeleteSpec(spec.id)}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="p-6 text-center text-muted-foreground italic">
                              No specifications added yet. Add them in the form.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              size="default"
              className="shadow-md min-w-[180px]"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Publishing...
                </>
              ) : (
                "Finish & Publish Listing"
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

SpecificationsStep.displayName = "SpecificationsStep";
