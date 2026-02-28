# Mes Actions - User Guide

## Accessing the Module
Navigate to the **"Mes Actions"** menu item in the sidebar or visit: `http://localhost:4200/mes-actions`

## Interface Overview

### Left Panel - Actions List
This panel displays all your assigned actions across all plans d'action.

#### Filtering Actions
1. **Filter by State**:
   - **Tous**: Show all actions
   - **P**: Show only Planifié (Planned) actions
   - **D**: Show only Réalisé (Completed) actions
   - **C**: Show only Vérifié (Verified) actions

2. **Sort Options**:
   - **Deadline**: Sort by action deadline (earliest first)
   - **Etat**: Sort by action state (P, D, C)

#### Action Item Display
Each action in the list shows:
- **Title**: The action name
- **Plan Name**: Which plan d'action it belongs to
- **Responsable**: Person responsible for the action
- **Deadline**: Due date with color coding:
  - 🟢 **Green**: More than 3 days remaining
  - 🟠 **Orange**: 1-3 days remaining
  - 🔴 **Red**: Overdue
- **State Badge**: Current status
  - **P** (Gray): Planifié - Not yet started
  - **D** (Orange): Réalisé - In progress/Completed
  - **C** (Green): Vérifié - Verified/Closed

### Right Panel - Action Details
Click any action in the left panel to view its full details.

#### Information Grid
The top section displays key information in 4 columns:

**Column 1 - Classification**
- Theme: Category of the action
- PREV/CORR: Preventive or Corrective
- Anomalie/Amelio: Anomaly or Improvement

**Column 2 - Dates & Metrics**
- Date creation: When the action was created
- Criticite: Importance level (Haute, Moyenne, Basse)
- Efficacite: Effectiveness rating

**Column 3 - Ownership**
- Responsable: Person responsible
- Plan d'Action: Which plan it belongs to
- Cause: Root cause of the action

**Column 4 - Timeline & Status**
- Delai: Deadline date
- Pilote: Project lead/pilot
- Etat: Current state (P/D/C buttons)

#### Realisation Section
Shows different content based on action state:

**State P (Planifié)**
- Message: "Cette action n'est pas encore realisee"
- Action: Click "Cloturer l'action" to move to state D

**State D (Réalisé)**
- Date de realisation: When the action was completed
- Commentaire de cloture: Completion notes
- Methode de verification: How it will be verified

**State C (Vérifié)**
- Success alert: "Action Verifiee"
- Date de realisation: Completion date
- Date de verification: When it was verified

#### Files Section
- **View Files**: List of attached documents with download buttons
- **Add Files**: Upload new files with descriptions

#### Comments Section
- **View History**: All comments and updates on the action
- **Add Comment**: Add your own notes and observations

## Color Coding Reference

### State Badges
| State | Color | Meaning |
|-------|-------|---------|
| P | Gray | Planifié (Planned) |
| D | Orange | Réalisé (Completed) |
| C | Green | Vérifié (Verified) |

### Deadline Colors
| Color | Days Remaining | Status |
|-------|-----------------|--------|
| Green | > 3 days | On track |
| Orange | 1-3 days | Urgent |
| Red | 0 or less | Overdue |

## Common Tasks

### View All Actions
1. Click "Tous" in the filter section
2. All actions will be displayed in the list

### Find Urgent Actions
1. Click "Tous" to show all actions
2. Look for actions with **red** deadline text
3. These are overdue or due within 1-3 days

### Track Action Progress
1. Select an action from the list
2. Check the state badge (P/D/C)
3. Review the "Realisation de l'Action" section
4. Read comments for latest updates

### Filter by Status
1. Click the desired state button (P, D, or C)
2. Only actions in that state will be shown
3. Click "Tous" to reset the filter

### Sort Actions
1. Use the "Trier par" dropdown
2. Select "Deadline" to see urgent actions first
3. Select "Etat" to group by status

## Tips & Best Practices

✅ **Do:**
- Check your actions regularly for updates
- Review deadlines to stay on track
- Add comments to document progress
- Attach supporting files for verification

❌ **Don't:**
- Ignore red deadline warnings
- Leave actions in "Planifié" state too long
- Skip the verification step (State C)
- Forget to document completion

## Keyboard Shortcuts
- **Escape**: Close action details (return to list)
- **Click action**: Open details
- **Scroll**: Navigate through long lists

## Troubleshooting

**Q: Why don't I see any actions?**
A: Check if you have a filter applied. Click "Tous" to show all actions.

**Q: How do I change an action's state?**
A: Click the state buttons (P/D/C) in the "Etat" section of the action details.

**Q: Can I edit action details?**
A: Currently, the module displays read-only information. Contact your administrator to modify action details.

**Q: How do I upload files?**
A: In the "Fichiers Annexes" section, enter a description and select a file, then click "Telecharger".

---

**Last Updated**: 2026-02-28
**Version**: 1.0

