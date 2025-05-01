export async function getStaticProps() {
  const res = await fetch("https://admin-marypeeofficial.vercel.app/api/sync?type=books&apiKey=sZ9DZXUSGwXffaV7OzPVqbdHD59ggtIRyqw2bDiyb21153c4");
  const books = await res.json();
  return { props: { books } };
}

export default function BooksPage({ books }: { books: any[] }) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>📚 Books</h1>
      <ul>
        {books.map((book, i) => (
          <li key={i}>
            <strong>{book.title}</strong><br />
            <small>{book.description}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}

