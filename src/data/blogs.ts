export type BlogPost = {
  id: string;
  author: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
  slug: string;
  title: string;
};

export const mockBlogPosts: BlogPost[] = [
  {
    author: "Admin",
    category: "Jewelry Care",
    date: "30 Oct, 2026",
    excerpt:
      "Simple daily habits that help preserve the polish, shine, and setting strength of your favorite fine jewelry pieces.",
    id: "celebrity-daughter-eye-color",
    image: "/corano/blog/blog-img1.jpg",
    readTime: "4 min read",
    slug: "celebrity-daughter-opens-up-about-eye-color",
    title: "Celebrity Daughter Opens Up About Having Her Eye Color Changed",
  },
  {
    author: "Admin",
    category: "Trends",
    date: "30 Oct, 2026",
    excerpt:
      "A look at statement styling, layered chains, and delicate silhouettes shaping the newest occasion-wear edits.",
    id: "children-left-home-alone-series",
    image: "/corano/blog/blog-img2.jpg",
    readTime: "5 min read",
    slug: "children-left-home-alone-for-four-days",
    title: "Children Left Home Alone For 4 Days In TV Series Experiment",
  },
  {
    author: "Admin",
    category: "Lifestyle",
    date: "30 Oct, 2026",
    excerpt:
      "From heirloom-inspired rings to modern everyday accents, these are the details customers keep coming back for.",
    id: "lotto-winner-date-offer",
    image: "/corano/blog/blog-img3.jpg",
    readTime: "3 min read",
    slug: "lotto-winner-offering-money-to-date",
    title: "Lotto Winner Offering Up Money To Any Man That Will Date Her",
  },
];
