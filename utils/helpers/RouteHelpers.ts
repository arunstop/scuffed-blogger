export function routeTrimQuery(urlWithQuery: string): string {
  return urlWithQuery.split("?")[0];
}
