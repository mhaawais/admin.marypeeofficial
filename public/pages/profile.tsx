export async function getStaticProps() {
  const res = await fetch("https://admin-marypeeofficial.vercel.app/api/sync?type=profile&apiKey=sZ9DZXUSGwXffaV7OzPVqbdHD59ggtIRyqw2bDiyb21153c4");
  const profile = await res.json();
  return { props: { profile } };
}

export default function ProfilePage({ profile }: { profile: any }) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>👤 {profile.name}</h1>
      <img src={profile.image} alt="Profile" width={120} />
      <p>{profile.bio}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </main>
  );
}

