import React from 'react';
import Link from 'next/link';

interface Feature {
  text: string;
}

interface ProductCardProps {
  icon: string;
  name: string;
  description: string;
  features: string[] | Feature[];
  href?: string;
  pattern?: 'dots' | 'grid' | 'waves' | 'gradient';
}

export default function ProductCard({
  icon,
  name,
  description,
  features,
  href = '/contact',
  pattern = 'dots'
}: ProductCardProps) {
  // Pattern backgrounds - Made more visible
  const patterns = {
    dots: "bg-[radial-gradient(circle_at_1px_1px,rgb(0,230,118,0.15)_1px,transparent_0)] [background-size:20px_20px]",
    grid: "bg-[linear-gradient(rgb(0,230,118,0.12)_1px,transparent_1px),linear-gradient(to_right,rgb(0,230,118,0.12)_1px,transparent_1px)] [background-size:30px_30px]",
    waves: "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDIwIFEgMTAgMTAgMjAgMjAgVCANMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsMjMwLDExOCwwLjE1KSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]",
    gradient: "bg-gradient-to-br from-vault-green-50/50 via-transparent to-vault-green-50/30"
  };

  const featureArray = features.map(f => typeof f === 'string' ? f : f.text);

  return (
    <div className="relative bg-white rounded-xl p-6 border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all overflow-hidden group">
      {/* Background pattern */}
      <div className={`absolute inset-0 ${patterns[pattern]} opacity-100`} />

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-vault-green-50/0 to-vault-green-50/0 group-hover:from-vault-green-50/20 group-hover:to-transparent transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h2 className="text-xl font-bold font-display text-vault-black mb-2">
          {name}
        </h2>
        <p className="text-sm text-vault-gray-600 mb-4">
          {description}
        </p>
        <ul className="space-y-2 mb-6">
          {featureArray.map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-4 h-4 text-vault-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-vault-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
