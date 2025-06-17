import { editByProp, removeByProp } from '@12luckydev/utils';
import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { v4 as uuidv4 } from 'uuid';
import { BooleanFormatter, WeddingMetadata } from '../models';

export const WeddingMetadataStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingMetadata>({
    _booleanFormatters: [
      { id: 'YES_NO', editable: false, trueLabel: 'Yes', falseLabel: 'No' },
      { id: 'TRUE_FALSE', editable: false, trueLabel: 'True', falseLabel: 'False' },
    ],
    _customBooleanFormatters: [{ id: uuidv4(), editable: true, trueLabel: '1', falseLabel: '0' }],
  }),
  withComputed(({ _booleanFormatters, _customBooleanFormatters }) => ({
    booleanFormatters: computed((): BooleanFormatter[] => {
      return [..._booleanFormatters(), ..._customBooleanFormatters()];
    }),
  })),
  withMethods((state) => ({
    addBooleanFormatter(trueLabel: string, falseLabel: string): string {
      const id = uuidv4();
      patchState(
        state,
        ({ _customBooleanFormatters, ...oldState }): WeddingMetadata => ({
          ...oldState,
          _customBooleanFormatters: [..._customBooleanFormatters, { id, editable: true, trueLabel, falseLabel }],
        }),
      );
      return id;
    },
    removeBooleanFormatter(id: string) {
      patchState(
        state,
        ({ _customBooleanFormatters, ...oldState }): WeddingMetadata => ({
          ...oldState,
          _customBooleanFormatters: removeByProp(_customBooleanFormatters, 'id', id),
        }),
      );
    },
    editBooleanFormatter(id: string, trueLabel: string, falseLabel: string) {
      patchState(
        state,
        ({ _customBooleanFormatters, ...oldState }): WeddingMetadata => ({
          ...oldState,
          _customBooleanFormatters: editByProp(
            _customBooleanFormatters,
            { id, trueLabel, falseLabel, editable: true },
            'id',
            id,
          ),
        }),
      );
    },
  })),
);
