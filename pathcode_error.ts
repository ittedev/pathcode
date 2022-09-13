export type PathCode = {
  path: string
  code: string
  params?: Record<string, string | number>
}

export type CodeMessage = {
  code: string,
  message: string
}

export class PathCodeError extends Error {
  private pathCodes: Array<PathCode>
  public codeMessages: Array<CodeMessage>

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

    this.codeMessages = []

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

  getMessages(...paths: Array<string | number>): Array<string> {
    const path = paths.join('.')
    return this.pathCodes
      .filter(pathCode => pathCode.path === path)
      .map(pathCode => {
        const codeMessage = this.codeMessages.find(codeMessage => codeMessage.code === pathCode.code)
        if (codeMessage) {
          return codeMessage.message.replace(/{{\s*(\w+)\s*}}/g, (_match, p1) => {
            const param = pathCode.params ? pathCode.params[p1] : undefined
            return (param || '') + ''
          })
        } else {
          return pathCode.code
        }
      })
  }

  get size() {
    return this.pathCodes.length
  }

  toJSON() {
    return this.pathCodes
  }
}
