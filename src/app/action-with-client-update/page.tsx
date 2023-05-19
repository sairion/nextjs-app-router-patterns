"use client"

import { useEffect, useState, useTransition } from "react"
import { getValue, updateValue } from "./actions"

function Button({
  action,
  children,
  onSuccess,
  onFail,
}: React.PropsWithChildren<{ action: () => Promise<number>; onSuccess: any; onFail: any }>) {
  let [isPending, startTransition] = useTransition()

  return (
    <button
      className={"p-4 border-[1px] " + (isPending ? "text-gray-500" : "")}
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            onSuccess(await action())
          } catch (e) {
            onFail(e)
          }
        })
      }}>
      {children}
    </button>
  )
}

export default function Page() {
  // const value = use(getValue()) // not sure why, but this explodes :(
  const [clientValue, setClientValue] = useState(0)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    getValue().then((v) => {
      setClientValue(v)
    })
  }, [])

  const handleSuccess = (result: number) => {
    setClientValue(result)
  }

  const handleFail = () => {
    setIsError(true)
    setTimeout(() => {
      setIsError(false)
    }, 2000)
  }

  return (
    <>
      <p>{isError ? "There was an error. Please try again" : null}</p>
      <p>
        value: {clientValue} {"(can't be less than 0)"}
      </p>
      <div className="flex flex-col gap-4 p-4">
        <Button action={() => updateValue(clientValue + 1)} onSuccess={handleSuccess} onFail={handleFail}>
          +1
        </Button>
        <Button action={() => updateValue(clientValue - 1)} onSuccess={handleSuccess} onFail={handleFail}>
          -1
        </Button>
      </div>
    </>
  )
}
