export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full py-8 md:py-10">
      <div className="w-full">{children}</div>
    </section>
  );
}
