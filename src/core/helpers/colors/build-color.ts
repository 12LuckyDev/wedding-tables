import { Color } from '../../models';
import { calcFontContrast } from './calc-font-contrast';
import { uuidToHexColor } from './uuid-to-hex-color';

export const buildColor = (uuid?: string | null): Color => {
  const backgroundColor = uuidToHexColor(uuid);

  return {
    backgroundColor,
    color: calcFontContrast(backgroundColor),
  };
};
