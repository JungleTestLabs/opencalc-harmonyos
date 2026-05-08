// OpenCalc — Calculator Engine
// Ported from Calculator.kt — recursive descent parser + math functions
import { ErrorFlags } from '../model/ErrorFlags'

export class CalcEngine {
  private eq: string = ''
  private p: number = -1
  private c: number = 0
  private deg: boolean = true

  evaluate(equation: string, isDegree: boolean): number {
    this.eq = equation; this.p = -1; this.c = 0; this.deg = isDegree
    this.nx(); return this.parseExpression()
  }
  private nx(): void { this.p++; this.c = this.p < this.eq.length ? this.eq.charCodeAt(this.p) : -1 }
  private eat(ch: number): boolean {
    while (this.c === 32) this.nx()
    if (this.c === ch) { this.nx(); return true }
    return false
  }
  private parseExpression(): number {
    let x: number = this.parseTerm()
    while (true) {
      if (this.eat(43)) x = x + this.parseTerm()
      else if (this.eat(45)) x = x - this.parseTerm()
      else return x
    }
  }
  private parseTerm(): number {
    let x: number = this.parseFactor()
    while (true) {
      if (this.eat(42)) x = x * this.parseFactor()
      else if (this.eat(35)) { let d: number = this.parseFactor(); if (d === 0) { ErrorFlags.division_by_0 = true; x = 0 } else x = x % d }
      else if (this.eat(47)) { let d: number = this.parseFactor(); if (d === 0) { ErrorFlags.division_by_0 = true; x = 0 } else x = x / d }
      else return x
    }
  }
  private parseFactor(): number {
    if (this.eat(43)) return +this.parseFactor()
    if (this.eat(45)) return -this.parseFactor()
    let x: number = 0; const sp: number = this.p
    if (this.eat(40)) { x = this.parseExpression(); if (!this.eat(41)) { ErrorFlags.syntax_error = true; x = 0 } }
    else if ((this.c >= 48 && this.c <= 57) || this.c === 46) {
      while ((this.c >= 48 && this.c <= 57) || this.c === 46) this.nx()
      const ns: string = this.eq.substring(sp, this.p)
      if (ns.split('.').length - 1 > 1 || (ns.length === 1 && ns.charAt(0) === '.')) { ErrorFlags.syntax_error = true; x = 0 }
      else x = parseFloat(ns)
    }
    else if (this.eat(101)) x = Math.E
    else if (this.eat(960)) x = Math.PI
    else if (this.c >= 97 && this.c <= 122) {
      while (this.c >= 97 && this.c <= 122) this.nx()
      const fn: string = this.eq.substring(sp, this.p)
      if (this.eat(40)) { x = this.parseExpression(); if (!this.eat(41)) x = this.parseFactor() } else x = this.parseFactor()
      if (fn === 'sqrt') { if (x >= 0) x = Math.sqrt(x); else ErrorFlags.require_real_number = true }
      else if (fn === 'factorial') x = this.fact(x)
      else if (fn === 'ln') { if (x <= 0) ErrorFlags.domain_error = true; else x = Math.log(x) }
      else if (fn === 'logtwo') { if (x <= 0) ErrorFlags.domain_error = true; else x = Math.log2(x) }
      else if (fn === 'logten') { if (x <= 0) ErrorFlags.domain_error = true; else x = Math.log10(x) }
      else if (fn === 'xp') x = this.powx(Math.E, x)
      else if (fn === 'sin') { x = Math.sin(this.deg ? x * Math.PI / 180 : x); if (x > 0 && x < 1e-14) x = Math.round(x) }
      else if (fn === 'cos') { x = Math.cos(this.deg ? x * Math.PI / 180 : x); if (x > 0 && x < 1e-14) x = Math.round(x) }
      else if (fn === 'tan') { x = Math.tan(this.deg ? x * Math.PI / 180 : x); if (x > 0 && x < 1e-14) x = Math.round(x) }
      else if (fn === 'arcsi') { if (Math.abs(x) > 1) ErrorFlags.domain_error = true; else { x = Math.asin(x); if (this.deg) x = x * 180 / Math.PI; if (x > 0 && x < 1e-14) x = Math.round(x) } }
      else if (fn === 'arcco') { if (Math.abs(x) > 1) ErrorFlags.domain_error = true; else { x = Math.acos(x); if (this.deg) x = x * 180 / Math.PI; if (x > 0 && x < 1e-14) x = Math.round(x) } }
      else if (fn === 'arcta') { x = Math.atan(x); if (this.deg) x = x * 180 / Math.PI; if (x > 0 && x < 1e-14) x = Math.round(x) }
      else ErrorFlags.syntax_error = true
    } else { ErrorFlags.syntax_error = true; x = 0 }
    if (this.eat(94)) x = this.powx(x, this.parseFactor())
    return x
  }
  private fact(n: number): number {
    if (n >= 3000) { ErrorFlags.is_infinity = true; return 0 }
    if (n < 0) { ErrorFlags.domain_error = true; return 0 }
    if (n === Math.floor(n)) { let r: number = 1; for (let i: number = 1; i <= n; i++) r = r * i; return r }
    return this.gl(n + 1)
  }
  private gl(x: number): number {
    const p: number[] = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7]
    const z: number = x - 1; let a: number = 0.9999999999998099
    for (let i: number = 0; i < p.length; i++) a = a + p[i] / (z + i + 1)
    return Math.sqrt(2 * Math.PI) * Math.pow(z + 7.5, z + 0.5) * Math.exp(-(z + 7.5)) * a
  }
  private powx(x: number, f: number): number {
    if (x === 0) return 0
    if (f > 10000) { ErrorFlags.is_infinity = true; return 0 }
    const ip: number = Math.trunc(f); const dp: number = f - ip
    if (x < 0 && dp !== 0) { ErrorFlags.require_real_number = true; return x }
    if (f > 0) return Math.pow(x, ip) * Math.pow(x, dp)
    return 1 / (Math.pow(x, -ip) * Math.pow(x, -dp))
  }
}
