const interleave = require('../src/utils/tagged-template-literal').interleave
const isLastLineNewLineOnly = require('../src/utils/general').isLastLineNewLineOnly

describe('utils', () => {
  describe('interleave', () => {
    it('should return the value of the node if no interpolation exists', () => {
      const raw = 'color: blue;'
      const quasis = [
        {
          value: {
            raw
          }
        }
      ]
      expect(interleave(quasis, [])).toEqual(raw)
    })

    it('should variabelize an interpolation', () => {
      const quasis = [
        {
          value: {
            raw: '\n  display: block;\n  color: '
          }
        },
        {
          value: {
            raw: ';\n  background: blue;\n'
          }
        }
      ]
      const expressions = [
        {
          name: 'color'
        }
      ]
      expect(interleave(quasis, expressions)).toEqual(
        '\n  display: block;\n  color: $color;\n  background: blue;\n'
      )
    })
  })

  describe('isLastLineNewLineOnly', () => {
    it('should return true for empty string', () => {
      expect(isLastLineNewLineOnly('')).toEqual(false)
    })

    it('should return true for string of spaces', () => {
      expect(isLastLineNewLineOnly('   ')).toEqual(false)
    })

    it('should return true for string of spaces and tabs', () => {
      expect(isLastLineNewLineOnly(' \t  ')).toEqual(false)
    })

    it('should return false for string with something other than space and tab', () => {
      expect(isLastLineNewLineOnly('not space')).toEqual(false)
    })

    it('should return true if last line has only space and tab', () => {
      expect(isLastLineNewLineOnly('not space\n  ')).toEqual(true)
    })
  })
})
