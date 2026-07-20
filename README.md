# BehaviorTree
# BehaviorTree.js

Moteur d'Arbre de Comportement (Behavior Tree) leger en JavaScript/TypeScript, executable via des fichiers JSON avec visualisation dynamique en temps reel.

---

## Structure de l'Arbre

```mermaid
flowchart TD
    ROOT[Root Selector]
    SEQ1[Sequence : Tenter ouverture]
    COND1[Condition : Has Key]
    ACT1[Action : Open Door]
    
    INV[Inverter : Porte Bloquee]
    SEQ2[Sequence : Action Secours]
    COND2[Condition : Can Break Door]
    ACT2[Action : Knock Door]

    ROOT --> SEQ1
    ROOT --> INV
    SEQ1 --> COND1
    SEQ1 --> ACT1
    INV --> SEQ2
    SEQ2 --> COND2
    SEQ2 --> ACT2
