export interface MainModalProps {
  value: boolean;
  onClose: () => void;
}

// CHECK FALSY
// Falsy values :
export type Falsy = false | 0 | -0 | 0n | "" | null | undefined;
export function isFalsy(
  value: unknown,
): // check if value is Falsy with the `type deprecaation`
value is Falsy {
  // then compare `value` to false to see the result
  return value == false;
}
