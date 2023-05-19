"use server"
import { setTimeout } from "node:timers/promises"

class HypotheticalDB {
  state = 5
  async validate(payload: number) {
    await setTimeout(10)
    if (payload < 0) {
      throw new Error("Value can't be less than 0")
    }
  }
  async get() {
    await setTimeout(30)
    return this.state
  }
  async update(payload: number) {
    await setTimeout(30)
    await this.validate(payload)
    this.state = payload
    return this.state
  }
}

const db = new HypotheticalDB()

export const getValue = async () => {
  return db.get()
}

export const updateValue = async (payload: number) => {
  return db.update(payload)
}
