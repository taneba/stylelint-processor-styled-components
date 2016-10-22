const babylon = require('babylon')
const traverse = require('babel-traverse').default

const isStyled = require('./utils/styled').isStyled
const isHelper = require('./utils/styled').isHelper
const isStyledImport = require('./utils/styled').isStyledImport
const getCSS = require('./utils/general').getCSS
const getKeyframes = require('./utils/general').getKeyframes

// TODO Make it work for the UMD build, i.e. global vars
// TODO Fix sourcemaps in result
// TODO ENFORCE THESE RULES
// value-no-vendor-prefix – don't allow vendor prefixes
// property-no-vendor-prefix – don't allow vendor prefixes

module.exports = (/* options */) => ({
  // Get string for stylelint to lint
  code(input) {
    const ast = babylon.parse(input, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
      ],
    })

    let extractedCSS = ''
    const importedNames = {
      default: false,
      css: false,
      keyframes: false,
      injectGlobal: false,
    }
    traverse(ast, {
      enter(path) {
        const node = path.node
        if (isStyledImport(node)) {
          const imports = node.specifiers.filter((specifier) => (
            specifier.type === 'ImportDefaultSpecifier'
            || specifier.type === 'ImportSpecifier'
          ))

          if (imports.length <= 0) return

          imports.forEach((singleImport) => {
            if (singleImport.imported) {
              // Is helper method
              importedNames[singleImport.imported.name] = singleImport.local.name
            } else {
              // Is default import
              importedNames.default = singleImport.local.name
            }
          })
        }

        const helper = isHelper(node, importedNames)

        if (helper === 'keyframes') {
          extractedCSS += getKeyframes(node)
          return
        }

        if (isStyled(node, importedNames.default) || helper === 'injectGlobal' || helper === 'css') {
          extractedCSS += getCSS(node)
        }
      },
    })

    return extractedCSS
  },
  // Fix sourcemaps
  result(stylelintResult) {
    // console.log(stylelintResult)
  },
})
