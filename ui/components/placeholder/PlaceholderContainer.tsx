import StatusPlaceholder, { StatusPlaceholderProps } from "./StatusPlaceholder";

interface PlaceholderContainerProps {
  placeholders: StatusPlaceholderProps[];
}
function PlaceholderContainer({ placeholders }: PlaceholderContainerProps) {
  return (
    <div className="flex w-full">
      {placeholders.map((e, idx) => {
        return <StatusPlaceholder key={idx} {...e} />;
      })}
    </div>
  );
}

export default PlaceholderContainer;
