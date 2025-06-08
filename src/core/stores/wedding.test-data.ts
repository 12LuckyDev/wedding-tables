import { v4 as uuidv4 } from 'uuid';
import { GuestModel } from '../models';
import { buildColor } from '../helpers';

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

export const ALL_GUESTS: GuestModel[] = PEOPLE.map((name, index) => {
  const model = new GuestModel(name);
  if (index === 0 || index === 1) {
    model.groupId = uuidv4();
    model.color = buildColor(model.groupId);
  } else if (Math.random() < 0.5) {
    model.groupId = groupId;
    model.color = buildColor(groupId);
  }

  return model;
});
