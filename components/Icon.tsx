import Image from 'next/image';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size = 24 }: IconProps) {
  // Support both .svg and .png icons
  const hasSvg = name !== 'back' && name !== 'budget';
  const iconPath = `/icons/${name}.${hasSvg ? 'svg' : 'png'}`;

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image
        src={iconPath}
        alt={name}
        width={size}
        height={size}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
