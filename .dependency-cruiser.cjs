/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Dependency cycles make modules impossible to reason about. Extract the shared piece into a third module both can import.",
      from: {},
      to: { circular: true },
    },
    {
      name: "registry-code-is-self-contained",
      severity: "error",
      comment:
        "components/ui, components/patterns, hooks and lib ship to consumers through the registry, where app/ and components/gallery do not exist. Move the shared code into the registry item, or have the gallery import it instead.",
      from: { path: "^(components/(ui|patterns)|hooks|lib)/" },
      to: { path: "^(app|components/gallery)/" },
    },
    {
      name: "site-code-stays-out-of-tests-internals",
      severity: "error",
      comment: "Tests exercise the gallery and registry through their modules; nothing in the product may import from tests/.",
      from: { pathNot: "^tests/" },
      to: { path: "^tests/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    exclude: { path: "^(scripts/smoke-fixture|public|\\.next)/" },
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require", "node", "default"] },
  },
};
