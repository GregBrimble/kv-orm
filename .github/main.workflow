workflow "Install and Test" {
  on = "push"
  resolves = [
    "Test",
    "Lint",
    "Build",
  ]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Bootstrap" {
  uses = "actions/npm@master"
  runs = "npx lerna bootstrap"
  needs = ["Install"]
}

action "Test" {
  uses = "actions/npm@master"
  runs = "npx lerna exec npm test"
  needs = ["Bootstrap"]
}

action "Lint" {
  uses = "actions/npm@master"
  runs = "npx lerna exec npm run lint"
  needs = ["Bootstrap"]
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Bootstrap"]
  runs = "npx lerna exec npm run build"
}
