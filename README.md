# split-editor

A Claude Code plugin that edits the prompt in a [herdr](https://herdr.dev)
split instead of taking over the terminal.

Claude Code's own external editor (`ctrl+g`) blanks Claude's screen until the
editor exits, so the transcript and any side panes vanish while you write.
This plugin opens `$VISUAL` / `$EDITOR` (default `nvim`) on the current draft
in a split below Claude's pane. Claude stays drawn; when the editor exits the
text goes back into the prompt box.

## Install

```
/plugin install split-editor --marketplace binerbuddy/claude-split-editor
```

Then bind `ctrl+g` to it in `~/.claude/keybindings.json` (the plugin listens on
the otherwise unbound `app:toggleDiffPreSession` action):

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    { "context": "Chat", "bindings": { "ctrl+g": null } },
    { "context": "Global", "bindings": { "ctrl+g": "app:toggleDiffPreSession" } }
  ]
}
```

`ctrl+x ctrl+e` still opens Claude Code's own editor. `/edit` does the same as
the chord.

## Requirements

Claude Code running inside a herdr pane, with `herdr` and `jq` on `PATH`.
Elsewhere it says so in a toast and leaves the draft alone.

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```

## License

MIT
