'use client';

type Props = {
  message: string;
  visible: boolean;
};

export function MessageOverlay({ message, visible }: Props) {
  if (!visible || !message) return null;

  return (
    <div className="mt-12 text-white text-4xl font-semibold max-w-4xl mx-auto px-8">
      {message}
    </div>
  );
}
