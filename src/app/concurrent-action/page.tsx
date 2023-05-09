"use client"

import { useTransition } from "react"
import { request1, request2 } from "./actions"

function Button({ action, children }: React.PropsWithChildren<{ action: () => Promise<void> }>) {
  let [isPending, startTransition] = useTransition()

  return (
    <button
      className={"p-4 border-[1px] " + (isPending ? "text-gray-500" : "")}
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          action()
        })
      }}>
      {children}
    </button>
  )
}

export default function Page() {
  return (
    <>
      <div>
        As of next.js version 13.4.1, there is no way you can make server actions work concurrently. (It may get fixed{" "}
        <a className="underline" href="https://twitter.com/sebmarkbage/status/1655403454808850432">
          soon
        </a>
        ) See `server-action-reducer.ts` and `app-router.tsx` which handles server action requests (action dispatches)
        how these stuff works internally. If you see `Network` tab in Chrome devtools, you can see the requests are made
        sequentially.
      </div>
      <div className="flex flex-col gap-4 p-4">
        <Button action={request1}>Send req 1 (takes 5 s to complete)</Button>
        <Button action={request2}>Send req 2 (takes 5 s to complete)</Button>
      </div>
    </>
  )
}
