export type Method = "GET" | "POST" | "PUT" | "PATCH"

export type Response = {
  statusCode: number
} & ({ ok: true; data: any } | { ok: false; error: any })

/**
 * Sends an HTTP request.
 * @returns The response body, converted to JSON if the headers say so.
 * @param url The URL to send the request to.
 * @param method The HTTP method to use.
 * @param payload An optional payload to send.
 */
export async function request(
  url: string,
  method: Method = "GET",
  payload?: any
): Promise<Response> {
  const isPayloadJSON = typeof payload == "object"

  const headers: any = {
    Accept: "application/json"
  }
  if (isPayloadJSON) {
    headers["Content-Type"] = "application/json"
  }

  const options: RequestInit = {
    method,
    headers
  }
  if (isPayloadJSON) {
    options.body = JSON.stringify(payload)
  }
  const fetchResponse = await fetch(url, options)

  let body
  const contentType = fetchResponse.headers.get("content-type")
  if (contentType && contentType.indexOf("application/json") !== -1) {
    body = await fetchResponse.json()
  } else {
    body = await fetchResponse.text()
  }

  return {
    statusCode: fetchResponse.status,
    ...(fetchResponse.ok
      ? {
          ok: true,
          data: body
        }
      : {
          ok: false,
          error: body
        })
  }
}

export async function get(url: string): Promise<Response> {
  return request(url, "GET")
}

export async function post(url: string, payload: any): Promise<Response> {
  return request(url, "POST", payload)
}

export async function put(url: string, payload: any): Promise<Response> {
  return request(url, "PUT", payload)
}

export async function patch(url: string, payload: any): Promise<Response> {
  return request(url, "PATCH", payload)
}
