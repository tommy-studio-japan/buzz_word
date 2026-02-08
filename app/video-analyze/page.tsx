"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";

function isValidHttpUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function VideoAnalyzePage() {
  const searchParams = useSearchParams();

  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [jobId, setJobId] = React.useState<string | null>(null);

  // tRPC
  const createJob = trpc.streams.createAnalysisJob.useMutation({
    onError: (err) => {
      setError(err.message || "ジョブ作成に失敗しました");
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
    },
  });

  const jobQuery = trpc.streams.getAnalysisJob.useQuery(
    { jobId: jobId ?? "" },
    {
      enabled: !!jobId,
      refetchInterval: (q) => {
        const st = q.state.data?.status;
        return st && (st === "DONE" || st === "FAILED") ? false : 1000;
      },
    },
  );

  // ?url= が付いている場合は初期入力に反映（手動入力優先）
  React.useEffect(() => {
    const u = searchParams.get("url");
    if (u && !url) setUrl(u);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("動画URLを入力してください");
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setError("有効なURL（https://〜）を入力してください");
      return;
    }
    console.log("動画アップロード開始:")

    setError(null);
    setJobId(null);

    createJob.mutate({ url: trimmed });
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">動画解析</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          YouTubeなどの動画URLを入力して、文字起こし・話題抽出の解析を開始します。
        </p>
      </div>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="video-url" className="text-sm font-medium">
              動画URL
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="video-url"
                name="video-url"
                type="url"
                inputMode="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                className="h-10 w-full flex-1 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-invalid={!!error}
                aria-describedby={error ? "video-url-error" : undefined}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={createJob.isPending}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {createJob.isPending ? "送信中…" : "解析を開始"}
              </button>
            </div>
            {error ? (
              <p id="video-url-error" className="text-sm text-destructive">
                {error}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                公開されているURLを入力してください（例：YouTube / Twitch VOD /
                アップロード済み動画など）。
              </p>
            )}
          </div>

          <div className="rounded-lg bg-muted/40 p-4 text-sm">
            <p className="font-medium">このページでやること</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>URLから音声抽出 → ASRで文字起こし</li>
              <li>話題ワードを抽出して秒単位でインデックス化</li>
              <li>切り抜き候補（ハイライト区間）を提示</li>
            </ul>
          </div>
        </form>

        {/* Progress */}
        {jobId ? (
          <div className="mt-5 rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">解析ジョブ</p>
              <p className="text-xs text-muted-foreground">Job ID: {jobId}</p>
            </div>

            {jobQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">状態を取得中…</p>
            ) : jobQuery.data ? (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm">
                    ステータス：<span className="font-medium">{jobQuery.data.status}</span>
                  </p>
                  <p className="text-sm tabular-nums">{jobQuery.data.progress}%</p>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${jobQuery.data.progress}%` }}
                    aria-label="progress"
                  />
                </div>

                {jobQuery.data.message ? (
                  <p className="mt-2 text-sm text-muted-foreground">{jobQuery.data.message}</p>
                ) : null}

                {jobQuery.data.status === "FAILED" ? (
                  <p className="mt-2 text-sm text-destructive">解析に失敗しました。URLや動画の状態を確認してください。</p>
                ) : null}

                {jobQuery.data.status === "DONE" ? (
                  <div className="mt-3 rounded-md bg-background p-3">
                    <p className="text-sm font-medium">次のアクション</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      解析結果ページ（文字起こし・話題・ヒートマップ）への遷移をここに繋げます。
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">ジョブ情報がありません。</p>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
