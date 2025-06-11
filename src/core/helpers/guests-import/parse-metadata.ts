import { forEachProp } from '@12luckydev/utils';
import { Metadata, MetadataField, MetadataRegistry, UnparsedMetadata } from '../../models';

export const parseMetadata = (unparsed: UnparsedMetadata, registry: MetadataRegistry): Metadata | undefined => {
  const metadata: Metadata = {};
  let sthSet = false;

  forEachProp(unparsed, (prop, key) => {
    const propType = typeof prop;
    if (propType !== 'string' && propType !== 'number' && propType !== 'boolean') {
      return;
    }

    metadata[key] = prop as MetadataField;

    const propsTypes = registry.get(key);
    if (propsTypes && !propsTypes.includes(propType)) {
      propsTypes.push(propType);
    } else {
      registry.set(key, [propType]);
    }
  });

  return sthSet ? metadata : undefined;
};
