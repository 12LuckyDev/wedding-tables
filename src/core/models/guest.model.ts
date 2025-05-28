import { v4 as uuidv4 } from 'uuid';

export interface Guest {
  id: string;
  name: string;
  initials: string;
}

export class GuestModel implements Guest {
  public id: string;
  public name: string;
  public initials: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.initials = name
      .split(' ')
      .map((part) => part[0] ?? '')
      .join('');
  }
}
