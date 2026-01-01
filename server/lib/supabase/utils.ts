   // Supabase embed shape can be object (many-to-one) or array (one-to-many)
    export const firstOrSelf = <T,>(v: any): T | null => {
        if (!v) return null;
        return Array.isArray(v) ? (v[0] ?? null) : (v as T);
      };