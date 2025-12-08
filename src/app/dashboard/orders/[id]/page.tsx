export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Order #{params.id}</h1>
      <div className="bg-glass-heavy rounded-2xl p-6">
        <p className="text-primary-300">Order detail page coming soon...</p>
      </div>
    </div>
  );
}
