{{/* Returns the name of the TLS secret */}}
{{- define "polkadot-watcher-auctions.tls-secret-name" -}}
{{ .Release.Name }}-tls
{{- end }}