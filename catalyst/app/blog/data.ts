/**
 * @deprecated This static data file has been replaced by the Supabase `blog_posts` table.
 * Use the server-side query functions in `app/lib/blog.ts` instead:
 *
 *   import { getBlogPosts, getBlogPost, getAllBlogSlugs } from "../lib/blog";
 */

// Re-export types for any code that may still reference this file during transition.
export type { BlogPost, BlogSection } from "../lib/blog";
