"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetBlogPostsQuery,
  useDeleteBlogPostMutation,
  useGetBlogCategoriesQuery,
  IBlogPost,
} from "@/services/api/blog/blog-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  StarOff,
  BookOpen,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function BlogPostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(25); // Fetch more per page in E2E dashboard list

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const {
    data: postsRes,
    isLoading,
    isFetching,
    refetch,
  } = useGetBlogPostsQuery({ page, limit });

  // Fetch categories for the filter select list
  const { data: categoriesRes } = useGetBlogCategoriesQuery();
  const categoriesList = categoriesRes?.items ?? [];

  const [deletePost] = useDeleteBlogPostMutation();

  const postsList = postsRes?.items ?? [];
  const totalPages = postsRes?.totalPages ?? 1;

  // Filter posts list locally for instant responses
  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || post.categoryId === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [postsList, searchQuery, statusFilter, categoryFilter]);

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        await deletePost(id).unwrap();
        toast.success("Blog post deleted successfully!");
        refetch();
      } catch (err: any) {
        console.error(err);
        toast.error(err?.data?.message || "Failed to delete the blog post.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-stone-950 dark:text-stone-50">
            Blog Articles (CMS)
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Publish, edit, and organize articles, news, and design guides on your storefront.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/dashboard/blog/posts/create")}
            className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-950 text-white font-bold gap-2 text-xs"
          >
            <Plus size={16} /> New Article
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
            className="bg-white dark:bg-stone-950 h-9 w-9 p-0"
          >
            <RefreshCw size={14} className={`${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-stone-50/50 dark:bg-stone-900/10 p-3 rounded-lg border border-stone-200/50 dark:border-stone-850">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-stone-950 h-9 text-xs"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-white dark:bg-stone-950 h-9 text-xs">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-stone-950">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-stone-950 h-9 text-xs">
              <SelectValue placeholder="Filter Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-stone-950">
              <SelectItem value="ALL">All Categories</SelectItem>
              {categoriesList.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="h-64 flex justify-center items-center">
            <RefreshCw size={24} className="animate-spin text-stone-400" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="h-64 flex flex-col justify-center items-center gap-2 text-stone-400 py-12">
            <BookOpen size={32} className="stroke-[1.5] text-stone-300" />
            <p className="italic text-sm">No matching articles found.</p>
            {searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" ? (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                }}
                className="text-stone-500 hover:text-stone-900 text-xs"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/blog/posts/create")}
                className="mt-2 text-xs"
              >
                Write First Article
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-100/50 dark:bg-stone-900/50">
                  <TableRow className="border-b">
                    <TableHead className="py-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[80px]">
                      Cover
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Title
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[150px]">
                      Category
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[100px] text-center">
                      Featured
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[100px]">
                      Status
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 w-[120px]">
                      Created Date
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center pr-6 w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-stone-100 dark:divide-stone-900">
                  {filteredPosts.map((post) => {
                    const isPublished = post.status === "PUBLISHED";
                    const statusColor = isPublished
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                      : "bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-800";

                    return (
                      <TableRow
                        key={post.id}
                        className="border-b text-xs hover:bg-stone-50/50 dark:hover:bg-stone-900/30"
                      >
                        <TableCell className="pl-6 py-3">
                          <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-100 border border-stone-200/50 dark:border-stone-800">
                            {post.image ? (
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-stone-100 text-[9px] text-stone-400">
                                No cover
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 font-semibold text-stone-900 dark:text-stone-100 max-w-[300px] truncate">
                          <span
                            onClick={() => router.push(`/dashboard/blog/posts/${post.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            {post.title}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-stone-600 dark:text-stone-400">
                          {post.category?.name || "Uncategorized"}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          {post.isFeatured ? (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mx-auto" />
                          ) : (
                            <StarOff className="h-4 w-4 text-stone-300 dark:text-stone-700 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className={`${statusColor} rounded-md font-semibold text-[10px]`}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-stone-400">
                          {new Date(post.createdAt).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell className="py-3 text-center pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-7 w-7 p-0 hover:bg-stone-100 dark:hover:bg-stone-900"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                            >
                              <DropdownMenuLabel className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
                              
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/blog/posts/${post.id}`)}
                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit Article
                              </DropdownMenuItem>
 
                              {isPublished && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer text-xs flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    View Storefront
                                  </Link>
                                </DropdownMenuItem>
                              )}
 
                              <DropdownMenuSeparator className="border-stone-100 dark:border-stone-900" />
 
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(post.id)}
                                className="cursor-pointer text-xs flex items-center gap-2 text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Article
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
 
            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/50">
                <span className="text-xs text-stone-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-8 w-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
