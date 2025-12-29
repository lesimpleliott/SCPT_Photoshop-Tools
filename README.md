# 📦 Scripts Photoshop – Export calques & logo

Une collection de scripts **ExtendScript (JSX)** pour Adobe Photoshop, permettant d’exporter chaque calque d’un groupe avec superposition d’un calque commun situé à la racine.

📁 **Les scripts sont stockés dans le dossier : `Scripts Photoshop/`**

---

## 🚀 Installation

### 1. Télécharger les éléments

[![Télécharger 1.0.0](https://img.shields.io/badge/TÉLÉCHARGER%201.0.0-ZIP-4CAF50?style=for-the-badge&logo=archive&logoColor=white)](https://github.com/lesimpleliott/SCPT_Photoshop-Tools/archive/refs/heads/main.zip)

### 2. Installer les scripts

- Ouvrez le fichier ZIP téléchargé.
- Rendez-vous dans le dossier `Scripts` de Photoshop :

```
/Applications/Adobe Photoshop [VOTRE VERSION]/Presets > Scripts
```

Placez le script souhaité dans le dossier et entrer votre mot de passe administrateur si nécessaire.

3. Redémarrer Photoshop
4. Lancer le script désiré via le menu :
   **Fichier > Scripts > ...**

---

## 🔎 Liste des scripts disponibles

_(D’autres scripts seront ajoutés au fur et à mesure.)_

### Export calques & logo

Le script ouvre une interface permettant de définir :

1. **Le groupe de calques à exporter**  
   Sélection d’un groupe (`LayerSet`) via un menu déroulant.

2. **Le(s) calque(s) commun(s) à appliquer sur chaque image**  
   Sélection d’un ou plusieurs calques racine via des cases à cocher.

3. **Le format d’export**  
   Deux formats stables et gérés par la version actuelle : `JPG` ou `PNG`.

4. **Le dossier de sortie**
   - Un dossier est automatiquement créé au nom du groupe sélectionné, au format :  
     `NOMDUGROUPE_export` (ex : `SERVICES_export`).
   - Si aucun dossier n’est choisi dans l’interface, le script utilise le **Bureau (Desktop)** par défaut.  
     → Sortie : `~/Desktop/NOMDUGROUPE_export`

> 💡 L’optimisation ou la compression des images n’est pas gérée dans ce script et devra faire l’objet d’un module dédié.

---

## ✍️ Auteur

**Eliott Lesimple (eLeGarage)**  
🔗 [GitHub – lesimpleliott](https://github.com/lesimpleliott)

---
