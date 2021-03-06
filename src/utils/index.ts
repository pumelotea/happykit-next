/**
 * UUID生成器
 */
export function uuid() {
  const s: any = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // tslint:disable-next-line:no-bitwise
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

/**
 * 深度拷贝
 * @param source
 */
export function deepClone(source: any) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments shallowClone')
  }
  const targetObj: any = source.constructor === Array ? [] : {}
  for (const keys in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/**
 * JSON转换增强
 * 针对map的处理
 * @param k
 * @param v
 */
export const jsonReplacer = (k: string, v: any) => {
  if (v instanceof Map) {
    const obj: any = {}
    v.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  } else {
    return v
  }
}

export function bin2hex(s: string) {
  let o = ''
  let n = ''
  s += ''

  for (let i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16)
    o += n.length < 2 ? '0' + n : n
  }
  return o
}

export function getCanvasFingerPrint(domain: string) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const txt = domain
  ctx.textBaseline = 'top'
  ctx.font = "14px 'Arial'"
  ctx.textBaseline = 'bottom'
  ctx.fillStyle = '#f60'
  ctx.fillRect(125, 1, 62, 20)
  ctx.fillStyle = '#069'
  ctx.fillText(txt, 2, 15)
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
  ctx.fillText(txt, 4, 17)

  const b64 = canvas.toDataURL().replace('data:image/png;base64,', '')
  const bin = atob(b64)
  return bin2hex(bin.slice(-16, -12))
}

export function getHash(input: any) {
  const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
  let hash = 20210731
  let i = input.length - 1

  if (typeof input === 'string') {
    for (; i > -1; i--) {
      hash += (hash << 5) + input.charCodeAt(i)
    }
  } else {
    for (; i > -1; i--) {
      hash += (hash << 5) + input[i]
    }
  }
  let value = hash & 0x7fffffff
  let retValue = ''
  do {
    retValue += I64BIT_TABLE[value & 0x3f]
    value >>= 2
  } while (value > 0)
  return retValue
}
