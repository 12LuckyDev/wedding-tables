import { MetadataFieldConfig, Metadata, BooleanFormatter } from '../../models';
import { applyBooleanFormatter } from './apply-boolean-formatters';

export const buildMetadataLine = (
  metadataConfig: Map<string, MetadataFieldConfig>,
  metadata: Metadata,
  booleanFormatters: BooleanFormatter[],
): string | null => {
  const builder: string[] = [];

  metadataConfig.forEach((config, key) => {
    if (!(key in metadata)) {
      return;
    }

    const { hidden, label, formatterId, isBoolean } = config;

    if (hidden) {
      return;
    }

    let metadataText = '';
    if (!!label) {
      metadataText += `${label}: `;
    }
    const value = metadata[key];
    metadataText += isBoolean ? applyBooleanFormatter(value as boolean, booleanFormatters, formatterId) : value;
    builder.push(metadataText);
  });

  return builder.length > 0 ? `\t${builder.join(', ')}` : null;
};
