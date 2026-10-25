import booleanPrefix from './rules/boolean-prefix.mjs'
import composableExport from './rules/composable-export.mjs'
import handlerNaming from './rules/handler-naming.mjs'
import maxFileLines from './rules/max-file-lines.mjs'
import noClassAssertion from './rules/no-class-assertion.mjs'
import noElse from './rules/no-else.mjs'
import noEnum from './rules/no-enum.mjs'
import noManualUiMerge from './rules/no-manual-ui-merge.mjs'
import noParentImport from './rules/no-parent-import.mjs'
import noReactiveDestructure from './rules/no-reactive-destructure.mjs'
import paddingLines from './rules/padding-lines.mjs'
import propGroup from './rules/prop-group.mjs'
import publicJsdoc from './rules/public-jsdoc.mjs'
import sfcBlockOrder from './rules/sfc-block-order.mjs'
import switchPerf from './rules/switch-perf.mjs'
import useTemplateRef from './rules/use-template-ref.mjs'

export default {
  meta: { name: 'hareui' },
  rules: {
    'no-else': noElse,
    'switch-perf': switchPerf,
    'no-enum': noEnum,
    'handler-naming': handlerNaming,
    'boolean-prefix': booleanPrefix,
    'no-reactive-destructure': noReactiveDestructure,
    'use-template-ref': useTemplateRef,
    'no-parent-import': noParentImport,
    'sfc-block-order': sfcBlockOrder,
    'composable-export': composableExport,
    'prop-group': propGroup,
    'public-jsdoc': publicJsdoc,
    'no-class-assertion': noClassAssertion,
    'padding-lines': paddingLines,
    'max-file-lines': maxFileLines,
    'no-manual-ui-merge': noManualUiMerge,
  },
}
