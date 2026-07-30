export type PluginEntry = {
  uses?: Array<{ plugin?: string; [key: string]: unknown }>;
  [key: string]: unknown;
};

export function buildPluginIdentifiers({
  pluginUrl,
  pluginOrgRepo,
}: {
  pluginUrl?: string | null;
  pluginOrgRepo?: string | null;
}): Set<string> {
  return new Set([pluginUrl, pluginOrgRepo].filter((value): value is string => Boolean(value)));
}

export function matchesPluginEntry(entryPlugin: string | undefined, identifiers: Set<string>): boolean {
  return Boolean(entryPlugin && identifiers.has(entryPlugin));
}

export function findPluginConfigIndex<T extends PluginEntry>(plugins: T[], identifiers: Set<string>): number {
  return plugins.findIndex((plugin) => matchesPluginEntry(plugin.uses?.[0]?.plugin, identifiers));
}

export function canonicalizePluginConfig<T extends PluginEntry>(pluginConfig: T, pluginOrgRepo?: string): T {
  if (!pluginOrgRepo) return pluginConfig;
  const uses = pluginConfig.uses?.length ? pluginConfig.uses : [{}];
  return {
    ...pluginConfig,
    uses: uses.map((use, index) => (index === 0 ? { ...use, plugin: pluginOrgRepo } : use)),
  } as T;
}

export function removePluginConfig<T extends PluginEntry>(plugins: T[], identifiers: Set<string>): T[] {
  return plugins.filter((plugin) => !matchesPluginEntry(plugin.uses?.[0]?.plugin, identifiers));
}
