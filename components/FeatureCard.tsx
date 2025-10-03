import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  pattern?: 'dots' | 'grid' | 'waves' | 'gradient';
}

export default function FeatureCard({
  icon,
  title,
  description,
  pattern = 'grid'
}: FeatureCardProps) {
  // Pattern backgrounds - Made more visible
  const patterns = {
    dots: "bg-[radial-gradient(circle_at_1px_1px,rgb(0,230,118,0.15)_1px,transparent_0)] [background-size:20px_20px]",
    grid: "bg-[linear-gradient(rgb(0,230,118,0.12)_1px,transparent_1px),linear-gradient(to_right,rgb(0,230,118,0.12)_1px,transparent_1px)] [background-size:30px_30px]",
    waves: "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIFEgMTAgMTAgMjAgMjAgVCANMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsMjMwLDExOCwwLjE1KSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]",
    gradient: "bg-gradient-to-br from-vault-green-50/50 via-transparent to-vault-green-50/30"
  };

  return (
    <div className="relative bg-white rounded-xl p-6 border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all overflow-hidden group">
      {/* Background pattern */}
      <div className={`absolute inset-0 ${patterns[pattern]} opacity-100`} />

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-vault-green-50/0 to-vault-green-50/0 group-hover:from-vault-green-50/20 group-hover:to-transparent transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="w-10 h-10 bg-vault-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-vault-green-100 transition-colors">
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold font-display text-vault-black mb-2">
          {title}
        </h3>
        <p className="text-sm text-vault-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
