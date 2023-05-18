// ref: https://twitter.com/asidorenko_/status/1658512418304323584
import { FileHandle, FileReadOptions, open } from "node:fs/promises"
import { Suspense } from "react"
import { ReadableStream } from "node:stream/web"

import { Buffer } from "node:buffer"
import { setTimeout } from "node:timers/promises"

class Source {
  type = "bytes" as const
  autoAllocateChunkSize = 1024
  file: FileHandle | undefined = undefined
  controller: ReadableByteStreamController | undefined = undefined

  async start(controller: ReadableByteStreamController) {
    this.file = await open(new URL(import.meta.url.replace("page.tsx", "text.txt")))
    this.controller = controller
  }

  async pull(controller: ReadableByteStreamController) {
    const view = controller.byobRequest?.view
    const readResult = await this.file?.read({
      buffer: view,
      offset: view?.byteOffset,
      length: view?.byteLength,
    } as FileReadOptions)

    if (!readResult) {
      return
    }

    if (readResult.bytesRead === 0) {
      await this.file?.close()
      controller.close()
    }
    controller.byobRequest?.respond(readResult.bytesRead)
  }
}

async function Reader({ reader }: { reader: ReadableStreamDefaultReader<Uint8Array> }) {
  const { done, value } = await reader.read()

  if (done) {
    return null
  }

  const str = Buffer.from(value).toString()
  await setTimeout(2500) // adjust this timeout

  return (
    <>
      {str}
      <Suspense
        fallback={
          <div className="text-center">
            <span className="inline-block animate-spin text-3xl">🍩</span>
          </div>
        }>
        {/* @ts-expect-error async component */}
        <Reader reader={reader} />
      </Suspense>
    </>
  )
}

export default function Page() {
  const byteSource = new Source()
  // @ts-expect-error : not sure how to correctly type bytesource in Node
  const stream = new ReadableStream(byteSource)
  const reader = stream.getReader()

  return (
    <>
      This is an example of how to do recursive suspense, probably useful to emit stream
      <div className="text-xs">
        <Suspense>
          {/* @ts-expect-error async component */}
          <Reader reader={reader} />
        </Suspense>
      </div>
    </>
  )
}
