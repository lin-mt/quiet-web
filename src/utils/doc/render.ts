import { HttpMethod } from '@/service/doc/type';

export function getMethodTagColor(method: string | HttpMethod): string {
  let input: HttpMethod;
  if (typeof method === 'string') {
    input = HttpMethod[method];
  } else {
    input = method;
  }
  let color: string;
  switch (input) {
    case HttpMethod.GET:
      color = 'green';
      break;
    case HttpMethod.HEAD:
      color = 'orange';
      break;
    case HttpMethod.DELETE:
      color = 'red';
      break;
    case HttpMethod.PUT:
      color = 'blue';
      break;
    case HttpMethod.POST:
    // case HttpMethod.CONNECT:
    case HttpMethod.OPTIONS:
    // case HttpMethod.TRACE:
    case HttpMethod.PATCH:
      color = 'orange';
      break;
    default:
      color = 'orange';
  }
  return color;
}