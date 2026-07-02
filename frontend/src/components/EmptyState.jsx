function EmptyState({ title }) {
  return (
    <div className="min-h-[250px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📭</div>

        <h2 className="text-2xl font-bold text-slate-700">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default EmptyState;