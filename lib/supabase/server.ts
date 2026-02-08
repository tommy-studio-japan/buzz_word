import { createClient } from "@supabase/supabase-js";
/** フロントエンドからはインポートしない。
 *  理由：supabaseから自作serverに移行する際にコストがかかるから
 *      将来はここをPrismaClientに置き換えるだけで完了する
 */

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase server client is misconfigured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',

  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
