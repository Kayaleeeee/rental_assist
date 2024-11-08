const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function apiGet<T>(url: string, params = {}): Promise<T> {
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=eq.${value}`)
    .join("&");

  const response = await fetch(
    `${apiUrl}/rest/v1${url}${paramString ? `?${paramString}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    }
  );

  const data = await response.json();
  return data as T;
}

export async function apiPost<T>(url: string, body: Record<string, any>) {
  const response = await fetch(`${apiUrl}/rest/v1${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to post data");
  }

  return response.ok;
}
