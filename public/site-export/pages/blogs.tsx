export async function getStaticProps() {
  const res = await fetch("https://admin-marypeeofficial.vercel.app/api/sync?type=blogs&apiKey=sZ9DZXUSGwXffaV7OzPVqbdHD59ggtIRyqw2bDiyb21153c4");
  const blogs = await res.json();
  return { props: { blogs } };
}

export default function BlogsPage({ blogs }: { blogs: any[] }) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>📝 Blogs</h1>
      <ul>
        {blogs.map((blog, i) => (
          <li key={i}>
            <strong>{blog.title}</strong><br />
            <small>{blog.summary}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}

