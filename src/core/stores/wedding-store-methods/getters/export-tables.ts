import { ExportConfig, Guest, Metadata, MetadataFieldConfig, Table } from '../../../models';

const buildMetadataLine = (metadataConfig: Map<string, MetadataFieldConfig>, metadata: Metadata): string | null => {
  const builder: string[] = [];

  metadataConfig.forEach((config, key) => {
    if (!(key in metadata)) {
      return;
    }

    if (config.hidden) {
      return;
    }

    let metadataText = '';
    metadataText += `${config.name}: `; //TODO showName
    metadataText += metadata[key]; //TODO formaters
    builder.push(metadataText);
  });

  return builder.length > 0 ? `\t${builder.join(', ')}` : null;
};

export const exportTables = (
  { anonymize, showMetadata, metadataConfig }: ExportConfig,
  tables: Table[],
  allGuests: Map<string, Guest>,
): string => {
  const builder: string[] = [];
  tables
    .toSorted((a, b) => a.number - b.number)
    .forEach(({ number, chairs }) => {
      const guests: Guest[] = chairs.filter((id) => !!id).map((id) => allGuests.get(id!)!);

      if (guests.length === 0) {
        return;
      }

      builder.push(`Table: ${number}:`);
      builder.push(`Guests amount: ${guests.length}:`);
      if (!anonymize) {
        guests.forEach(({ name, metadata }) => {
          let line = `\t${name}`;

          if (showMetadata && metadata) {
            const text = buildMetadataLine(metadataConfig, metadata);
            if (text) {
              line += text;
            }
          }

          builder.push(line);
        });
      }
      builder.push('\n');
    });
  return builder.join('\n');
};
