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
    if (!!config.label) {
      metadataText += `${config.label}: `;
    }
    metadataText += metadata[key]; //TODO formaters
    //TODO add filters
    //TODO add counters
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
