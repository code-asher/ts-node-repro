import * as cp from "child_process"

const childEnvName = "_IS_CHILD"
const isChild = process.env[childEnvName]

function log(...args: any[]) {
  const name = isChild ? "child" : "parent"
  console.log(`[${name}:${process.pid}]`, ...args)
}

process.on("exit", () => log("exiting"))

function setupChild() {
  log("setting up")

  setInterval(() => log("waiting"), 1000)

  process.on("message", (m) => {
    log("received message", m)
    process.exit(0)
  })
}

function setupParent() {
  log("setting up")

  const child = cp.spawn(process.argv[0], process.argv.slice(1), {
    env: {
      [childEnvName]: "true",
      ...process.env,
    },
    stdio: ["ipc"],
  })

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.send({ fromParent: true })
}

if (isChild) {
  setupChild()
} else {
  setupParent()
}
