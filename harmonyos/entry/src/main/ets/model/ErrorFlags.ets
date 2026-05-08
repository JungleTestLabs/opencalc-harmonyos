// OpenCalc — Error Flags (shared mutable state)
// ArkTS: imported variables are read-only, so use a class with static mutable fields

export class ErrorFlags {
  static syntax_error: boolean = false
  static division_by_0: boolean = false
  static domain_error: boolean = false
  static is_infinity: boolean = false
  static require_real_number: boolean = false

  static reset(): void {
    ErrorFlags.syntax_error = false
    ErrorFlags.division_by_0 = false
    ErrorFlags.domain_error = false
    ErrorFlags.is_infinity = false
    ErrorFlags.require_real_number = false
  }
}
