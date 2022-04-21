type PathCode = {
  path: string
  code: string
  params?: {
    [key: string]: string
  }
}

export class PathCodeError extends Error {
  private pathCodes: Array<PathCode>

  constructor(code: string)
  constructor(path: string, code: string)
  constructor(pathCodes: Array<PathCode>)
  constructor(codeOrPath: string | Array<PathCode>, mayCode?: string) {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PathCodeError)
    }
    Object.defineProperty(this, 'name', { value: 'PathCodeError' })


    if (Array.isArray(codeOrPath)) {
      this.pathCodes = codeOrPath
    } else {
      this.pathCodes = new Array<PathCode>()

      const path = mayCode ? codeOrPath : ''
      const code = mayCode ? mayCode : codeOrPath
      this.pathCodes.push({ path, code })
    }
  }

  add(code: string): void
  add(path: string, code: string): void
  add(codeOrPath: string, mayCode?: string): void {
    const path = mayCode ? codeOrPath : ''
    const code = mayCode ? mayCode : codeOrPath

    const pathCode = this.pathCodes.find(
      pathCode => pathCode.path === path && pathCode.code === code
    )
    if (!pathCode) {
      this.pathCodes.push({ path, code })
    }
  }

  assign(error: PathCodeError, prefix?: number | string): void {
    error.pathCodes.forEach(pathCode => {
      this.pathCodes.push({
        path: prefix + (pathCode.path ? '.' + pathCode.path : ''),
        code: pathCode.code
      })
    })
  }

  toJSON() {
    return this.pathCodes
  }
}
