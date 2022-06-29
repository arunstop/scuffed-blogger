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

export type NetworkResponseStatus = "loading" | "success" | "error";

export interface MainNetworkResponse<T = unknown> {
  message: string;
  status: NetworkResponseStatus;
  data: T;
}

// FACTORY
export const createErrorResponse = (
  message: string,
): MainNetworkResponse<null> => ({ status: "error", data: null, message });

export const createSuccessResponse = <T>(
  message: string,
  data: T,
): MainNetworkResponse<T> => ({ status: "success", data: data, message });
