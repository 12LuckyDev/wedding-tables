import { v4 as uuidv4 } from 'uuid';
import { Color } from './color.model';
import { buildColor } from '../helpers';
import { Metadata } from './metadata.type';

export interface Guest {
  id: string;
  name: string;
  initials: string;
  groupId?: string;
  color: Color;
  metadata?: Metadata;
}

export class GuestModel implements Guest {
  public id: string;
  public name: string;
  public initials: string;
  public color: Color;
  public groupId?: string;
  public metadata?: Metadata;

  constructor(name: string, groupId?: string) {
    this.id = uuidv4();
    this.name = name;
    this.groupId = groupId;
    this.color = buildColor(groupId);

    this.initials = name
      .split(' ')
      .map((part) => part[0] ?? '')
      .join('');
  }
}
