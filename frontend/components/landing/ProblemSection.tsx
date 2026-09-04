export function ProblemSection() {
  return (
    <section className="py-16 bg-gray-50 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Why Water Planning Matters</h2>
      <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-8">
        Irrigation decisions are often made by guesswork. That costs water, fuel,
        and harvests.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-rose-600 mb-2">70%</p>
          <p className="text-xs text-gray-600">
            Agriculture uses roughly 70% of the world's fresh water (FAO/UN).
            Every litre pumped at the wrong time is a litre your farm and your
            community lose.
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-amber-600 mb-2">up to 50%</p>
          <p className="text-xs text-gray-600">
            Experts estimate that up to half of irrigation water is lost to
            overwatering, poor timing, leaks and evaporation. Pumps also burn fuel
            and electricity that you may not have needed to use.
          </p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <p className="text-2xl font-extrabold text-blue-600 mb-2">75%</p>
          <p className="text-xs text-gray-600">
            Smallholder farmers grow around three-quarters of the food in
            sub-Saharan Africa. Matching irrigation to real soil and weather data
            helps protect those harvests.
          </p>
        </div>
      </div>
    </section>
  );
}