// https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  preset: "angular",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          // release: "major" | "minor" | "patch"
          { breaking: true, release: "minor" }, // Do not create a major release as long as we are in the v0.x.x!
          { type: "build", release: "patch" }, // Changes that affect the build system or external dependencies
          { type: "ci", release: "patch" }, // Changes to our CI configuration files and scripts
          { type: "docs", release: "patch" }, // Documentation only changes
          { type: "feat", release: "minor" }, // A new feature
          { type: "fix", release: "patch" }, // A bug fix
          { type: "perf", release: "patch" }, // A code change that improves performance
          { type: "refactor", release: "patch" }, // A code change that neither fixes a bug nor adds a feature
          { type: "test", release: "patch" }, // Adding missing tests or correcting existing tests
          { type: "chore", release: "patch" }, // TODO: It's not a part of angular preset. Seems like refactor has similar semantics?
        ],
        parserOpts: { noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"] },
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    ["@semantic-release/github", { successComment: false, failTitle: false }],
  ],
};
