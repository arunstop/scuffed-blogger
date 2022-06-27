import _ from "lodash";

export function routeTrimQuery(urlWithQuery: string): string {
  return urlWithQuery.split("?")[0];
}

export function strKebabify(str: string): string {
  return _.kebabCase(str);
}
