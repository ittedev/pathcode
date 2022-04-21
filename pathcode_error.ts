type PathCode = {
  path: string
  code: string
  params?: Record<string, string | number>
}

export class PathCodeError extends Error {
  private pathCodes: Array<PathCode>

  constructor()
  constructor(code: string, params?: Record<string, string | number>)
  constructor(path: string, code: string, params?: Record<string, string | number>)
  constructor(pathCodes: Array<PathCode>)
  constructor(
    codeOrPath?: string | Array<PathCode>,
    paramsOrCode?: string | Record<string, string | number>,
    mayParams?: Record<string, string | number>
  )
  {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PathCodeError)
    }
    Object.defineProperty(this, 'name', { value: 'PathCodeError' })


    if (Array.isArray(codeOrPath)) {
      this.pathCodes = codeOrPath
    } else {
      this.pathCodes = new Array<PathCode>()
      if (codeOrPath !== undefined) {
        this.add(codeOrPath, paramsOrCode as string, mayParams)
      }
    }
  }

  add(code: string, params?: Record<string, string | number>): void
  add(path: string, code: string, params?: Record<string, string | number>): void
  add(
    codeOrPath: string,
    paramsOrCode?: string | Record<string, string | number>,
    mayParams?: Record<string, string | number>
  ): void
  {
    const path = paramsOrCode && typeof paramsOrCode === 'string' ? codeOrPath : ''
    const code = paramsOrCode && typeof paramsOrCode === 'string' ? paramsOrCode : codeOrPath
    const params = paramsOrCode && typeof paramsOrCode === 'object' ? paramsOrCode : mayParams || false

    const pathCode = this.pathCodes.find(
      pathCode => pathCode.path === path && pathCode.code === code
    )
    if (pathCode) {
      if (params) {
        pathCode.params = params
      }
    } else {
      const pathCode: PathCode = { path, code }
      if (params) {
        pathCode.params = params
      }
      this.pathCodes.push(pathCode)
    }
  }

  assign(error: PathCodeError, prefix?: number | string): void {
    error.pathCodes.forEach(pathCode => {
      const newpathCode: PathCode = {
        path: prefix + (pathCode.path ? '.' + pathCode.path : ''),
        code: pathCode.code
      }
      if (pathCode.params) {
        newpathCode.params = { ...pathCode.params }
      }
      this.pathCodes.push(newpathCode)
    })
  }

  toJSON() {
    return this.pathCodes
  }
}
