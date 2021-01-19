/**
 * Expands inlines variable declarators into their own declarations
 * ie.
 *   const foo = 1, bar = 2;
 * becomes
 *   const foo = 1;
 *   const bar = 2;
 * @param {*} babel
 */
export default function (babel) {
  const { types: t } = babel;

  return {
    name: "babel-expand-declarations",
    visitor: {
      VariableDeclaration(path) {

        if (path.node.declarations.length === 1) return;
        const node = path.node;
        const declarations = path.node.declarations;
        const singles = declarations.map(d => {
          return t.variableDeclaration(node.kind, [d])
        })
        path.replaceWithMultiple(singles)
      }
    }
  };
}