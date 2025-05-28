import { v4 as uuidv4 } from 'uuid';
import { GuestModel } from '../../../core/models';
import { calcFontContrast, uuidToHexColor } from '../../../core/helpers';

const PEOPLE = [
  'Bianca Dawson',
  'Iker Adams',
  'Stella Gonzalez',
  'Ethan Woodward',
  'Drew Buchanan',
  'Enrique Buck',
  'Livia Wall',
  'Issac Hernandez',
  'Camila Alexander',
  'Kingston Stokes',
  'Miranda Walls',
  'Larry Esquivel',
  'Jan Kowalski',
];

const groupId = uuidv4();
const bgColor = uuidToHexColor(groupId);
const color = calcFontContrast(bgColor);

export const ALL_GUESTS: GuestModel[] = PEOPLE.map((name) => {
  const model = new GuestModel(name);
  if (Math.random() < 0.5) {
    model.groupId = groupId;
    model.bgColor = bgColor;
    model.color = color;
  }
  return model;
});
