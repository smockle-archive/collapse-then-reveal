'use strict'

function isTreeViewOpen () {
  // Whether package is installed & enabled
  if (
    !(atom.packages.isPackageLoaded('tree-view') &&
      atom.packages.isPackageActive('tree-view'))
  ) {
    return false
  }
  // Whether tree-view DOM is rendered
  const treeView = atom.packages.getActivePackage(
    'tree-view'
  ).mainModule.treeView
  if (!treeView || atom.views.getView(treeView).parentNode == null) {
    return false
  }
  // Whether tree-view is in a visible left dock
  if (
    atom.workspace.getLeftDock &&
    atom.workspace.getLeftDock().element.querySelector('.tree-view')
  ) {
    return atom.workspace.getLeftDock().state.visible
  }
  // Whether tree-view is in a visible right dock
  if (
    atom.workspace.getRightDock &&
    atom.workspace.getRightDock().element.querySelector('.tree-view')
  ) {
    return atom.workspace.getRightDock().state.visible
  }
  return false
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
