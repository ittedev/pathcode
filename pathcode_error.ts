type PathCodeList = {
  path: string
  code: string
}

export class PathCodeError extends Error {
  private pathCodes: Array<PathCodeList>

  constructor(code: string)
  constructor(path: string, code: string)
  constructor(pathCodes: Array<PathCodeList>)
  constructor(codeOrPath: string | Array<PathCodeList>, mayCode?: string) {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PathCodeError)
    }
    Object.defineProperty(this, 'name', { value: 'PathCodeError' })


    if (Array.isArray(codeOrPath)) {
      this.pathCodes = codeOrPath
    } else {
      this.pathCodes = new Array<PathCodeList>()

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

  toJSON() {
    return this.pathCodes
  }
}
