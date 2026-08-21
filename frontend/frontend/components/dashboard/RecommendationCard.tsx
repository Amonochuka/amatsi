export function RecommendationCard({ recommendation }: { recommendation: string }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
      <span className="text-xs font-semibold text-emerald-700 uppercase">Recommendation</span>
      <p className="mt-2 text-sm text-emerald-900">{recommendation}</p>
    </div>
  );
}
