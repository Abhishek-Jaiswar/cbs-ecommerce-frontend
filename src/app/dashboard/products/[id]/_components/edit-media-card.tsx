"use client";

import * as React from "react";
import {
  useUploadImagesMutation,
  useDeleteImageMutation,
} from "@/services/api/products/products-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Trash, Upload, Image as ImageIcon } from "lucide-react";

interface EditMediaCardProps {
  productId: string;
  product: any;
  refetchProduct: () => void;
}

export function EditMediaCard({
  productId,
  product,
  refetchProduct,
}: EditMediaCardProps) {
  const [uploadImages, { isLoading: isUploadingImages }] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  // Image Upload States
  const [uploadColorId, setUploadColorId] = React.useState("");
  const [uploadFiles, setUploadFiles] = React.useState<FileList | null>(null);

  const handleUploadImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadColorId || !uploadFiles || uploadFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }
    formData.append("colorId", uploadColorId);
    formData.append("colorIds", uploadColorId);

    try {
      await uploadImages({ productId, formData }).unwrap();
      setUploadColorId("");
      setUploadFiles(null);
      const fileInput = document.getElementById("edit-image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage({ productId, imageId }).unwrap();
      refetchProduct();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
              <Check className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-base font-bold">4. Media & Gallery</CardTitle>
          </div>
          <CardDescription className="text-xs">Upload images mapping directly to the configured color codes.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Card */}
          <Card className="bg-background border-border/60">
            <CardHeader className="pb-3 p-4">
              <CardTitle className="text-sm font-bold">Upload Images</CardTitle>
              <CardDescription className="text-[11px]">Upload photos. Each set maps to an active product color.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUploadImages}>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Associate Color Mapping *</label>
                  <Select value={uploadColorId} onValueChange={setUploadColorId} required>
                    <SelectTrigger className="w-full bg-background border-input text-xs text-foreground h-8">
                      <SelectValue placeholder="Choose color to map" />
                    </SelectTrigger>
                    <SelectContent>
                      {product?.colors?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Select File Assets *</label>
                  <Input
                    id="edit-image-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setUploadFiles(e.target.files)}
                    className="h-9 text-xs bg-background border-input cursor-pointer"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t border-border/60 py-3 px-4 flex justify-end">
                <Button type="submit" size="sm" className="h-8 gap-1" disabled={isUploadingImages || !uploadColorId || !uploadFiles}>
                  <Upload className="h-3.5 w-3.5" /> Upload File(s)
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Gallery Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-background border-border/60 h-full">
              <CardHeader className="pb-3 p-4">
                <CardTitle className="text-sm font-bold">Image Gallery</CardTitle>
                <CardDescription className="text-[11px]">Media uploaded in system catalog for this product.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {product?.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.images.map((img: any) => (
                      <div
                        key={img.id}
                        className="relative aspect-square border border-border rounded-lg overflow-hidden group shadow-sm bg-muted/20"
                      >
                        <img
                          src={img.media?.url}
                          alt={img.media?.altText || "Product photo"}
                          className="object-cover w-full h-full"
                        />
                        {img.isPrimary && (
                          <Badge className="absolute top-1.5 left-1.5 bg-primary text-white shadow-sm text-[8px] py-0 px-1">
                            Primary
                          </Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-250 shadow rounded-md"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-white text-[9px] truncate text-center font-medium">
                          {product.colors?.find((c: any) => c.id === img.colorId)?.name || "Default"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border rounded-xl min-h-[140px]">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <p className="text-xs font-semibold">No media uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
