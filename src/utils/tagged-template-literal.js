/**
 * Check if a node is a tagged template literal
 */
const isTaggedTemplateLiteral = (node) => node.type === 'TaggedTemplateExpression'

/**
 * Check if a tagged template literal has interpolations
 */
const hasInterpolations = (node) => !node.quasi.quasis[0].tail

const getName = (expression) => {
  if (expression.name) return expression.name.substr(0, expression.name.length - 1)

  if (expression.loc && expression.loc.start.line === expression.loc.end.line) return new Array(expression.loc.end.column - expression.loc.start.column).join('a')

  return undefined
}

/**
 * Merges the interpolations in a parsed tagged template literals with the strings
 *
 * TODO Fix undefined expression.name
 */
const interleave = (quasis, expressions) => (
  expressions.reduce((prev, expression, index) => (
    prev.concat(`/*${getName(expression)}*/`, quasis[index + 1].value.raw)
  ), [quasis[0].value.raw]).join('')
)

/**
 * Get the content of a tagged template literal
 *
 * TODO Cover edge cases
 */
const getTaggedTemplateLiteralContent = (node) => {
  if (hasInterpolations(node)) {
    return interleave(node.quasi.quasis, node.quasi.expressions)
  } else {
    return node.quasi.quasis[0].value.raw
  }
}

exports.isTaggedTemplateLiteral = isTaggedTemplateLiteral
exports.getTaggedTemplateLiteralContent = getTaggedTemplateLiteralContent
exports.interleave = interleave
