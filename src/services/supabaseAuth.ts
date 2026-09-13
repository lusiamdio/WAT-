const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ACCESS_TOKEN_KEY = 'wat_supabase_access_token';

function config(): HeadersInit {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase authentication is not configured.');
  return { apikey: supabaseAnonKey, 'Content-Type': 'application/json' };
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function authenticatedHeaders(headers: HeadersInit = {}): Headers {
  const result = new Headers(headers);
  const token = getAccessToken();
  if (token) result.set('Authorization', `Bearer ${token}`);
  return result;
}

export async function signInWithPassword(email: string, password: string): Promise<{ id: string; email: string }> {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: config(), body: JSON.stringify({ email, password }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token || !body.user?.id) throw new Error(body.error_description || body.msg || 'Unable to sign in.');
  sessionStorage.setItem(ACCESS_TOKEN_KEY, body.access_token);
  return { id: body.user.id, email: body.user.email || email };
}

export async function signOut(): Promise<void> {
  const token = getAccessToken();
  if (token && supabaseUrl && supabaseAnonKey) {
    await fetch(`${supabaseUrl}/auth/v1/logout`, { method: 'POST', headers: authenticatedHeaders({ apikey: supabaseAnonKey }) });
  }
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
