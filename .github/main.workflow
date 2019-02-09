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

action "Lint" {
  uses = "actions/npm@master"
  runs = "npx lerna exec npm run lint"
  needs = ["Bootstrap"]
}

action "Build" {
  uses = "actions/npm@master"
  runs = "npx lerna exec npm run build"
  needs = ["Lint"]
}

action "Test" {
  uses = "actions/npm@master"
  runs = "npx lerna exec npm test"
  needs = ["Build"]
}
