import { getPosts, searchPosts } from '@/lib/post';
import PostCard from '@/components/post/PostCard';

type SearchParams = {
  search?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function PostsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.search || '';

  const posts = query ? await searchPosts(query) : await getPosts();
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
