import axios from 'axios';
import { Request } from 'express';

export async function proxyServiceRequest(
  req: Request,
  method: 'get' | 'post' | 'delete' | 'patch',
  url: string,
  body?: unknown,
  params?: unknown
) {
  const response = await axios({
    method,
    url,
    data: body,
    params,
    headers: {
      Cookie: req.headers.cookie || '',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  return response;
}
