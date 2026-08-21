export function ProblemSection() {
  return (
    <section className="py-16 bg-gray-50 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">The Smallholder Challenge</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-rose-600 mb-2">40%</p>
          <p className="text-xs text-gray-600">Water wasted due to manual or scheduled watering right before rainfall.</p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-amber-600 mb-2">High Energy</p>
          <p className="text-xs text-gray-600">Excess fuel and electricity costs spent running pumps unnecessarily.</p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-blue-600 mb-2">Low Yields</p>
          <p className="text-xs text-gray-600">Crop stress caused by poorly timed under-watering or waterlogging.</p>
        </div>
      </div>
    </section>
  );
}