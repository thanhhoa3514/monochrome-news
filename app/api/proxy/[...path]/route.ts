import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, toApiUrl } from "@/lib/api/config";

type ProxyContext = {
  params: {
    path: string[];
  };
};

async function proxyRequest(request: NextRequest, { params }: ProxyContext) {
  const requestHeaders = new Headers(request.headers);
  const authToken = cookies().get(AUTH_COOKIE_NAME)?.value;
  const targetPath = `/${params.path.join("/")}`;
  const backendUrl = `${toApiUrl(targetPath)}${request.nextUrl.search}`;

  requestHeaders.delete("host");
  requestHeaders.delete("connection");
  requestHeaders.delete("content-length");
  requestHeaders.delete("cookie");

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (authToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(backendUrl, {
    method: request.method,
    headers: requestHeaders,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = response.headers.get("content-type");
  const cacheControl = response.headers.get("cache-control");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  if (cacheControl) {
    responseHeaders.set("cache-control", cacheControl);
  }

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });
}

export { proxyRequest as GET };
export { proxyRequest as POST };
export { proxyRequest as PUT };
export { proxyRequest as PATCH };
export { proxyRequest as DELETE };
