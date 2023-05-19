import data from "./data"
import { setTimeout } from "node:timers/promises"
import Link from "next/link"
import { Suspense } from "react"

/*
  This is implementation of 'load more' pattern, which uses naive Suspense recursion trick. But it sends whole page load on update (not only updated page fragment), so it needs to be improved/avoided.
*/
async function hypotheticalPageFetch(pageNumber: number) {
  await setTimeout(200)
  return data.pages[pageNumber - 1]
}

async function RecursivePage({ limit, pageNumber }: { limit: number; pageNumber: number }) {
  if (pageNumber > limit) {
    return null
  }
  const page = await hypotheticalPageFetch(pageNumber)

  return (
    <Suspense>
      <div className="mb-4">
        <div className="font-bold">Cursor:{page.cursor}</div>
        {page.data}
      </div>
      {/* @ts-expect-error async component */}
      <RecursivePage limit={limit} pageNumber={pageNumber + 1} />
    </Suspense>
  )
}

function Loadmore({ nextPage }: { nextPage: number }) {
  return (
    <Link className="border-[1px] border-solid p-4 block my-4" href={`/pagination-loadmore?page=${nextPage}`}>
      Load more.
    </Link>
  )
}

export default function Page({ searchParams }: { searchParams: Record<"page", number> }) {
  const pageNumber = Number(searchParams.page ?? 1)

  return (
    <>
      <div>
        {/* @ts-expect-error async component */}
        <RecursivePage pageNumber={1} limit={pageNumber} />
        {data.pagesTotal > pageNumber ? <Loadmore nextPage={pageNumber + 1} /> : null}
      </div>
    </>
  )
}
