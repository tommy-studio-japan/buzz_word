import { createClient } from "@supabase/supabase-js";
/** フロントエンドからはインポートしない。
 *  理由：supabaseから自作serverに移行する際にコストがかかるから
 *      将来はここをPrismaClientに置き換えるだけで完了する
 */

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);