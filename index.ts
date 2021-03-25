import * as cp from "child_process"

const childEnvName = "_IS_CHILD"
const isChild = process.env[childEnvName]

function log(...args: any[]) {
  const name = isChild ? "child" : "parent"
  console.log(`[${name}:${process.pid}]`, ...args)
}

process.on("exit", () => log("exiting"))

function setupChild() {
  setInterval(() => log("waiting"), 1000)

  setTimeout(() => {
    log("never got message")
    process.exit(1)
  }, 10000)

  process.on("message", (m) => {
    log("received message", m)
    process.exit(0)
  })

  process.send({ fromChild: true })
}

function setupParent() {
  const child = cp.spawn(process.argv[0], process.argv.slice(1), {
    env: {
      [childEnvName]: "true",
      ...process.env,
    },
    stdio: ["ipc"],
  })

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.on("message", (m) => {
    log("received message", m)
    child.send({ fromParent: true })
  })

  // Exit with the same code.
  child.on("exit", process.exit)

  // Same problem if we immediately send a message; waiting to hear from the
  // child process is to demonstrate the messages work one way and to make sure
  // there isn't some kind of timing issue with sending too quickly.
  // child.send({ fromParent: true })
}

log("setting up")

if (isChild) {
  setupChild()
} else {
  setupParent()
}
