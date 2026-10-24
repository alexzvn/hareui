import { toRaw } from 'vue'

// Standard Schema v1 interface (https://standardschema.dev), copied as the spec allows so no runtime dependency is needed.
import type { FormError } from '../components/form/types'

export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}

export declare namespace StandardSchemaV1 {
  export interface Props<Input = unknown, Output = Input> {
    readonly version: 1
    readonly vendor: string
    readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>
    readonly types?: Types<Input, Output> | undefined
  }
  export type Result<Output> = SuccessResult<Output> | FailureResult
  export interface SuccessResult<Output> {
    readonly value: Output
    readonly issues?: undefined
  }
  export interface FailureResult {
    readonly issues: ReadonlyArray<Issue>
  }
  export interface Issue {
    readonly message: string
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
  }
  export interface PathSegment {
    readonly key: PropertyKey
  }
  export interface Types<Input = unknown, Output = Input> {
    readonly input: Input
    readonly output: Output
  }
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input']
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output']
}

/** The part of a Superstruct `Struct` that form validation uses. */
export interface SuperstructSchema<T = unknown> {
  readonly TYPE: T
  schema: unknown
  coercer: (...args: never[]) => unknown
  validator: (...args: never[]) => unknown
  refiner: (...args: never[]) => unknown
  validate: (
    value: unknown,
  ) => [{ failures: () => { message: string; path: PropertyKey[] }[] } | undefined, T | undefined]
}

export interface ValidateSchemaResult<T> {
  result: T | null
  errors: FormError[] | null
}

// `in` throws on primitives, and ArkType schemas are functions
function hasKeys(value: unknown): value is object {
  return (typeof value === 'object' || typeof value === 'function') && value !== null
}

export function isStandardSchema(schema: unknown): schema is StandardSchemaV1 {
  return hasKeys(schema) && '~standard' in schema
}

export function isSuperstructSchema(schema: unknown): schema is SuperstructSchema {
  return (
    hasKeys(schema) &&
    'schema' in schema &&
    'coercer' in schema &&
    typeof schema.coercer === 'function' &&
    'validator' in schema &&
    typeof schema.validator === 'function' &&
    'refiner' in schema &&
    typeof schema.refiner === 'function'
  )
}

/** Joins an issue path into the dotted field `name` it belongs to (`address.city`, `items.0.qty`); `''` for form-level issues. */
function issueName(path: StandardSchemaV1.Issue['path']): string {
  return (path ?? []).map((segment) => String(hasKeys(segment) ? segment.key : segment)).join('.')
}

async function validateStandardSchema<T>(
  state: unknown,
  schema: StandardSchemaV1<unknown, T>,
): Promise<ValidateSchemaResult<T>> {
  const result = await schema['~standard'].validate(state)
  if (result.issues)
    return {
      errors: result.issues.map((issue) => ({
        name: issueName(issue.path),
        message: issue.message,
      })),
      result: null,
    }
  return { errors: null, result: result.value }
}

function validateSuperstructSchema<T>(
  state: unknown,
  schema: SuperstructSchema<T>,
): ValidateSchemaResult<T> {
  const [error, result] = schema.validate(state)
  if (error)
    return {
      errors: error
        .failures()
        .map((failure) => ({ name: failure.path.map(String).join('.'), message: failure.message })),
      result: null,
    }
  return { errors: null, result: result ?? null }
}

/** Validates `state` with a Standard Schema or a Superstruct struct; issues become errors named by their dotted path. */
export async function validateSchema<T>(
  state: unknown,
  schema: StandardSchemaV1<unknown, T> | SuperstructSchema<T>,
): Promise<ValidateSchemaResult<T>> {
  // A schema kept in reactive state arrives as a proxy, and Zod 4 reads its internals through `this` in a getter
  const raw = toRaw(schema)
  if (isStandardSchema(raw))
    return validateStandardSchema(state, raw as StandardSchemaV1<unknown, T>)
  if (isSuperstructSchema(raw)) return validateSuperstructSchema(state, raw as SuperstructSchema<T>)
  throw new Error(
    'Form validation failed: unsupported schema. Pass a Standard Schema or a Superstruct struct.',
  )
}

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/** Reads the value at a dotted path; the object itself for an empty path. */
export function getAtPath(data: unknown, path?: string): unknown {
  if (!path) return data
  let node = data
  for (const key of path.split('.')) {
    if (!hasKeys(node)) return undefined
    node = (node as Record<string, unknown>)[key]
  }
  return node
}

/** Writes `value` at a dotted path, creating objects (or arrays for numeric segments) along the way. An empty path merges into `data`. */
export function setAtPath<T extends object>(data: T, path: string, value: unknown): T {
  if (!path) return Object.assign(data, value)
  const keys = path.split('.')
  if (keys.some((key) => UNSAFE_KEYS.has(key))) return data
  let node = data as Record<string, unknown>
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      node[key] = value
      return
    }
    if (!hasKeys(node[key])) node[key] = /^\d+$/.test(keys[i + 1]!) ? [] : {}
    node = node[key] as Record<string, unknown>
  })
  return data
}
