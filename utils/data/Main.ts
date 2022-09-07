export interface ModalProps {
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
export const netLoading = <T = null>(
  message?: string,
  data?: T,
): MainNetworkResponse<T | null> => ({
  status: "loading",
  data: data ? data : null,
  message:message||"",
});

export const netError = <T = null>(
  message: string,
  data?: T,
): MainNetworkResponse<T | null> => ({
  status: "error",
  data: data ? data : null,
  message,
});

export const netSuccess = <T>(
  message: string,
  data: T,
): MainNetworkResponse<T> => ({ status: "success", data: data, message });


export interface ApiPagingReqProps {
  start: number;
  count: number;
  keyword?: string;
}
export interface ApiPagingResultProps {
  offset: number;
  total: number;
  keyword?: string;
}
