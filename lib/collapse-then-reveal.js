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
  // Prevent executing twice within a single active pane change
  const activePane = atom.workspace.getActivePane()
  const isNewActivePane = (activePane.activeItem || {}).id !== this.activeID &&
    (e || {buffer: null}).hasOwnProperty('buffer')

  if (isTreeViewOpen() && isNewActivePane) {
    // Store activeID
    this.activeID = (activePane.activeItem || {}).id

    // Collapse inactive items
    atom.packages.getActivePackage('tree-view')
      .mainModule
      .treeView
      .roots
      .forEach(panelElement => {
        panelElement.collapse(true)
        panelElement.expand()
      });

    // Reveal active item
    const workspaceView = atom.views.getView(atom.workspace)
    if (activePane.activeItem && !activePane.activeItem.uri) {
      atom.commands.dispatch(workspaceView, 'tree-view:reveal-active-file')
    }
    atom.workspace.getCenter().activate()
  }
}

module.exports = {
  observer: null,
  activeID: (atom.workspace.getActivePane().activeItem || {}).id,

  activate: function () {
    if (!this.observer) {
      this.observer = atom.workspace.onDidChangeActivePaneItem(main.bind(this))
    }
  },

  deactivate: function () {
    if (this.observer) {
      this.observer.dispose()
      this.observer = null
    }
  }
}
