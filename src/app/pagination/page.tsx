import data from "./data"
import { setTimeout } from "node:timers/promises"
import Link from "next/link"

async function hypotheticalPageFetch(pageNumber: number) {
  await setTimeout(200)
  return data.pages[pageNumber - 1]
}

async function Pagination({ pageNumber }: { pageNumber: number }) {
  const page = await hypotheticalPageFetch(pageNumber)
  return (
    <div>
      <div className="h-60">{page.data}</div>
      <div className="flex w-20 justify-between text-xl gap-2">
        {Array.from({ length: data.pagesTotal }).map((_, i) => (
          <Link className="block" key={i + 1} href={`/pagination?page=${i + 1}`}>
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Page({ searchParams }: { searchParams: Record<"page", number> }) {
  return (
    <>
      <div>
        {/* @ts-expect-error async component */}
        <Pagination pageNumber={searchParams.page} />
      </div>
    </>
  )
}
