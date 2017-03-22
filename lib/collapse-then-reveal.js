'use strict'

function isTreeViewOpen () {
  var panelView, treeView
  if (
    !(atom.packages.isPackageLoaded('tree-view') &&
      atom.packages.isPackageActive('tree-view'))
  ) {
    return false
  }
  treeView = atom.packages.getActivePackage('tree-view').mainModule.treeView
  if (!(treeView && treeView.panel)) {
    return false
  }
  panelView = atom.views.getView(treeView.panel)
  if (panelView.parentNode == null) {
    return false
  }
  return true
}

function main (e) {
  var panelElement, workspaceView, activePane

  if (isTreeViewOpen()) {
    // Collapse inactive items
    panelElement = atom.packages.getActivePackage(
      'tree-view'
    ).mainModule.treeView.roots[0]
    panelElement.collapse(true)
    panelElement.expand()

    // Reveal active item
    workspaceView = atom.views.getView(atom.workspace)
    activePane = atom.workspace.getActivePane()
    if (activePane.activeItem && !activePane.activeItem.uri) {
      atom.commands.dispatch(workspaceView, 'tree-view:reveal-active-file')
      activePane.activate()
    }
  }
}

module.exports = {
  observer: null,

  activate: function () {
    if (!this.observer) {
      this.observer = atom.workspace.onDidChangeActivePaneItem(main)
    }
  },

  deactivate: function () {
    if (this.observer) {
      this.observer.dispose()
      this.observer = null
    }
  }
}
