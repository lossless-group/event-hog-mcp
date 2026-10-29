# event-hog-kit

The kit behind event-hog: event-maxxing (prep, during, post, follow-ups) for a
team working a conference together from Claude or Codex, over MCP.

- `skills/`: playbooks the event-hog server serves through `list_skills` and
  `get_skill`. Each is a standard `SKILL.md`. Skills that aren't specific to one
  CRM or client belong here.
- `templates/event/`: the skeleton a new event workspace starts from.
- `config/skills.json`: **per-deployment** settings, such as which research tools
  each person has (keyed by the address their CRM knows them by). Replace it
  with your own when you adopt the kit.

Some skills are written here first, because they only make sense with
event-hog (`parallel-content-generation-starters`); edit those here. Others
originate in the public `lossless-agent-skills` repo on GitHub
(`augment-speakers-panelists`); edit those there, then copy here. CRM-specific skills live with that CRM's
deployment (for Edviro, `hubspot-brain/agent-skills`), and the server reads
those after the kit.
