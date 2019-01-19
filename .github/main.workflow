workflow "Install and Test" {
  on = "push"
  resolves = ["Test"]
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
