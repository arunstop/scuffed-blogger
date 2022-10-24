import { useCallback, useRef } from "react";
interface IntersectionObserverHookProps {
  //   delay?: number;
  callback?: (intersecting: boolean) => void | Promise<void>;
}

export function useIntersectionObserverHook({
  callback,
}: IntersectionObserverHookProps) {
  //   const [intersecting, setIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    observer.current = new IntersectionObserver((entries) => {
      const intersecting = entries[0].isIntersecting;
      callback?.(intersecting);
    });
    if (node) observer.current?.observe(node);
  }, []);

  return { ref };
}
