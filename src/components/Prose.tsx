type Props = {
  html: string;
  className?: string;
};

export function Prose({ html, className }: Props) {
  return (
    <div
      className={`prose-custom ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
