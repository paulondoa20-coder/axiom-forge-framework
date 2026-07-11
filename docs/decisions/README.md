# Journal de décisions (ADR & Decision Log)

Toute décision **structurante** (architecture, sécurité, contrat de domaine, choix de librairie, politique de sync, RLS non triviale) doit être tracée ici.

## Types de fichiers

| Type | Nom | Quand |
|---|---|---|
| **ADR** | `docs/architecture/ADR-<num>-<slug>.md` | Décision d'architecture large, longue durée, impact multi-domaines. |
| **Decision log** | `docs/decisions/YYYY-MM-DD-<slug>.md` | Décision locale (un domaine, un choix technique ponctuel, un trade-off). |

## Convention ADR

```markdown
# ADR-<num> — <Titre>

- Statut : Proposé | Accepté | Superseded by ADR-<n> | Déprécié
- Date : YYYY-MM-DD
- Contexte : ...
## Décision
...
## Alternatives envisagées
...
## Conséquences
...
```

## Convention Decision Log

```markdown
# <YYYY-MM-DD> — <Titre>

- TASK-ID : P<phase>-<num>
- Domaine : <name>
- Auteur : <agent/dev>
## Décision
...
## Pourquoi
...
## Impacts
...
```

## Règles
1. **Une décision = un fichier**. Pas d'agrégat.
2. Une décision **ne modifie jamais** une ADR antérieure : elle en crée une nouvelle avec statut `Superseded by`.
3. Toute PR qui change un contrat d'API, un schéma DB, une politique RLS ou une règle de sync doit inclure le fichier de décision correspondant.
4. Le lecteur doit pouvoir comprendre la décision **sans lire le code**.

## Index
<!-- Ajouter chaque nouvelle décision ici, plus récente en tête. -->
- 2026-07-11 — [ADR-002 Workflow multi-agents](../architecture/ADR-002-multi-agent-workflow.md)
- (antérieur) — [ADR-001 Séparation domaines / packages](../architecture/ADR-001-domain-package-separation.md)
