import { describe, expect, it } from 'vitest'

import { toJsonText, tokenizeJson } from '@/components/chat-tool/json'

const typesOf = (text: string) =>
  tokenizeJson(text)
    .filter((token) => token.type !== 'plain')
    .map((token) => `${token.type}:${token.text}`)

describe('chat-tool json', () => {
  it('keeps a short value on one line when compact', () => {
    expect(toJsonText({ city: 'Paris' }, true)).toBe('{"city":"Paris"}')
  })

  it('indents a value too long for one line, and every value when not compact', () => {
    const long = { query: 'quiet cafés with long opening hours', near: 'Old Town', limit: 10 }

    expect(toJsonText(long, true)).toContain('\n  "near": "Old Town"')
    expect(toJsonText({ city: 'Paris' })).toBe('{\n  "city": "Paris"\n}')
  })

  it('leaves strings as they are', () => {
    expect(toJsonText('{"city": "Pa', true)).toBe('{"city": "Pa')
  })

  it('types keys, strings, numbers, literals and punctuation', () => {
    expect(typesOf('{"a": "x", "b": [1.5, true, null]}')).toEqual([
      'punctuation:{',
      'key:"a"',
      'punctuation::',
      'string:"x"',
      'punctuation:,',
      'key:"b"',
      'punctuation::',
      'punctuation:[',
      'number:1.5',
      'punctuation:,',
      'number:true',
      'punctuation:,',
      'number:null',
      'punctuation:]',
      'punctuation:}',
    ])
  })

  it('types partial JSON, including an unterminated string', () => {
    expect(typesOf('{"to": "ana@exam')).toEqual([
      'punctuation:{',
      'key:"to"',
      'punctuation::',
      'string:"ana@exam',
    ])
  })

  it('keeps the text intact', () => {
    const text = '{\n  "items": ["a \\"b\\"", -2e3]\n}'

    expect(
      tokenizeJson(text)
        .map((token) => token.text)
        .join(''),
    ).toBe(text)
  })

  it('leaves text that is not JSON as one plain piece', () => {
    expect(tokenizeJson('128 lines')).toEqual([{ type: 'plain', text: '128 lines' }])
  })
})
