import { forEachProp } from '@12luckydev/utils';
import { Metadata, MetadataField, UnparsedMetadata } from '../../models';

export const parseMetadata = (unparsed: UnparsedMetadata): Metadata | undefined => {
  const metadata: Metadata = {};
  let sthSet = false;

  forEachProp(unparsed, (prop, key) => {
    const propType = typeof prop;
    if (propType !== 'string' && propType !== 'number' && propType !== 'boolean') {
      return;
    }

    metadata[key] = prop as MetadataField;
  });

  return sthSet ? metadata : undefined;
};
