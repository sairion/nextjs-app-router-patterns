"use server"
import { setTimeout } from "node:timers/promises"

export const request1 = async () => {
  console.log("[server] request 1: start")
  await setTimeout(5_000)
  console.log("[server] request 1: done")
}

export const request2 = async () => {
  console.log("[server] request 2: start")
  await setTimeout(5_000)
  console.log("[server] request 2: done")
}
