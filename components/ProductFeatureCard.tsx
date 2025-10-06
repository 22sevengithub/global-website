import React from 'react';

interface ProductFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ProductFeatureCard({
  icon,
  title,
  description
}: ProductFeatureCardProps) {
  return (
    <div className="group flex flex-col items-center text-center p-6 bg-white rounded-xl border border-vault-gray-200 transition-all duration-500 hover:scale-110 hover:z-20 hover:bg-vault-green hover:text-white hover:border-transparent hover:shadow-lg cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center mb-4 transition-all duration-500 group-hover:w-16 group-hover:h-16">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-vault-black mb-2 group-hover:text-white">
        {title}
      </h3>
      <p className="text-sm text-vault-gray-600 leading-relaxed group-hover:text-white">
        {description}
      </p>
    </div>
  );
}
