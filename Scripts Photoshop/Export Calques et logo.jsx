function truncateEnd(str, max) {
  if (str.length <= max) return str;
  return "..." + str.slice(-max);
}

// tronque un path en gardant N segments depuis la fin
function truncatePathSegments(path, count) {
  var parts = path.split("/");
  var clean = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] && parts[i] !== "") clean.push(parts[i]);
  }
  if (!clean.length) return "...";

  var slice = clean.slice(-count);
  return ".../" + slice.join("/");
}

function main() {
  var doc = app.activeDocument;
  var selectedGroup = doc.layerSets.length ? doc.layerSets[0].name : "";
  var selectedFolder = null;
  var selectedFormat = "jpg";

  // ===== UI =====
  var win = new Window("dialog", "Export calques & logo");
  win.orientation = "column";
  win.alignChildren = "left";
  win.margins = 16;
  win.spacing = 12;

  // --- Groupe ---
  var groupRow = win.add("group");
  groupRow.orientation = "row";
  groupRow.alignChildren = "center";
  groupRow.spacing = 6;

  groupRow.add("statictext", undefined, "Groupe d’images à exporter :");
  var groupDropdown = groupRow.add("dropdownlist", undefined);
  groupDropdown.preferredSize.width = 220;

  for (var g = 0; g < doc.layerSets.length; g++) {
    groupDropdown.add("item", doc.layerSets[g].name);
  }
  groupDropdown.selection = 0;

  groupDropdown.onChange = function () {
    if (this.selection) selectedGroup = this.selection.text;
  };

  // --- Calques communs ---
  var titleLayers = win.add("statictext", undefined, "Calques communs");
  titleLayers.graphics.font = ScriptUI.newFont("Arial", "bold", 13);
  titleLayers.margins = [0, 6, 0, 4];

  var layerPanel = win.add("panel", undefined);
  layerPanel.orientation = "row";
  layerPanel.alignChildren = "top";
  layerPanel.spacing = 20;
  layerPanel.margins = 10;
  layerPanel.preferredSize.width = 420;

  var col1 = layerPanel.add("group");
  var col2 = layerPanel.add("group");
  col1.orientation = "column";
  col2.orientation = "column";
  col1.preferredSize.width = 180;
  col2.preferredSize.width = 180;
  col1.alignChildren = "left";
  col2.alignChildren = "left";
  col1.spacing = 2;
  col2.spacing = 2;

  // --- Ajout des checkboxes avec icônes ---
  function addLayerCheckbox(layer, parent) {
    var shortName = truncateEnd(layer.name, 20);

    // si c’est un groupe de calques
    if (layer.typename === "LayerSet") {
      parent.add("checkbox", undefined, "📁 " + shortName);
    }
    // sinon c’est un calque normal
    else {
      parent.add("checkbox", undefined, "🌇 " + shortName);
    }
  }

  var rootLayers = doc.layers;
  var midpoint = Math.ceil(rootLayers.length / 2);

  for (var i = 0; i < rootLayers.length; i++) {
    var parent = i < midpoint ? col1 : col2;
    addLayerCheckbox(rootLayers[i], parent);
  }

  // --- Export + choix dossier ---
  var exportRow = win.add("group");
  exportRow.orientation = "row";
  exportRow.alignChildren = "center";
  exportRow.spacing = 6;
  exportRow.alignment = ["fill", "center"];

  exportRow.add("statictext", undefined, "Export");

  var formatDropdown = exportRow.add("dropdownlist", undefined, ["jpg", "png"]);
  formatDropdown.preferredSize.width = 80;
  formatDropdown.selection = 0;
  selectedFormat = formatDropdown.selection.text.toLowerCase();

  formatDropdown.onChange = function () {
    if (this.selection) selectedFormat = this.selection.text.toLowerCase();
  };

  var outBtn = exportRow.add("button", undefined, "Choisir dossier...");
  outBtn.preferredSize.width = 120;

  var outPathText = exportRow.add("statictext", undefined, ".../Desktop");
  outPathText.alignment = ["fill", "center"];
  outPathText.graphics.font = ScriptUI.newFont("Arial", "regular", 10);
  outPathText.characters = 10;

  // --- Sélection dossier ---
  outBtn.onClick = function () {
    var folder = Folder.selectDialog("Sélectionner le dossier de sortie");
    selectedFolder = folder ? folder : new Folder("~/Desktop");

    if (selectedFolder) {
      outPathText.text = truncatePathSegments(selectedFolder.fsName, 2);
    }
  };

  // --- Boutons action ---
  var btnContainer = win.add("group");
  btnContainer.orientation = "row";
  btnContainer.alignChildren = "center";
  btnContainer.alignment = "center";
  btnContainer.spacing = 10;
  btnContainer.margins = [0, 10, 0, 0];

  var cancelBtn = btnContainer.add("button", undefined, "Annuler");
  var runBtn = btnContainer.add("button", undefined, "Lancer");

  cancelBtn.onClick = function () {
    win.close();
  };

  // === PROCESS EXPORT ===
  runBtn.onClick = function () {
    if (!selectedGroup) {
      alert("Aucun groupe sélectionné.");
      return;
    }

    if (!selectedFolder || !selectedFolder.exists) {
      selectedFolder = new Folder("~/Desktop");
    }

    // créer dossier au nom du groupe en majuscules + suffixe _export
    var folderName = selectedGroup.toUpperCase() + "_export";
    var exportFolder = new Folder("~/Desktop/" + folderName);
    if (!exportFolder.exists) {
      exportFolder.create();
    }
    selectedFolder = exportFolder;

    var group = doc.layerSets.getByName(selectedGroup);

    for (var i = 0; i < group.layers.length; i++) {
      var layer = group.layers[i];
      var tempDoc = doc.duplicate();
      var tempGroup = tempDoc.layerSets.getByName(selectedGroup);

      for (var n = 0; n < tempGroup.layers.length; n++) {
        tempGroup.layers[n].visible = false;
      }

      tempGroup.layers[i].visible = true;
      tempDoc.mergeVisibleLayers();

      var file = new File(
        selectedFolder.fsName + "/" + layer.name + "." + selectedFormat
      );

      if (selectedFormat === "png") {
        var pngOptions = new PNGSaveOptions();
        tempDoc.saveAs(file, pngOptions, true, Extension.LOWERCASE);
      }

      if (selectedFormat === "jpg") {
        var jpgOptions = new JPEGSaveOptions();
        jpgOptions.quality = 12;
        tempDoc.saveAs(file, jpgOptions, true, Extension.LOWERCASE);
      }

      tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    }

    alert("Export terminé !");
    win.close();
  };

  win.show();
}

main();
