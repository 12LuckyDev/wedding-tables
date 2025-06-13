import { removeByProp } from '@12luckydev/utils';
import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { v4 as uuidv4 } from 'uuid';
import { BooleanFormatter, WeddingMetadata } from '../models';

export const WeddingMetadataStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingMetadata>({
    _booleanFormatters: [
      { id: 'YES_NO', trueLabel: 'Yes', falseLabel: 'No' },
      { id: 'TRUE_FALSE', trueLabel: 'True', falseLabel: 'False' },
    ],
    _customBooleanFormatters: [],
  }),
  withComputed(({ _booleanFormatters, _customBooleanFormatters }) => ({
    booleanFormatters: computed((): BooleanFormatter[] => {
      return [..._booleanFormatters(), ..._customBooleanFormatters()];
    }),
  })),
  withMethods((state) => ({
    addBooleanFormatter(trueLabel: string, falseLabel: string) {
      patchState(
        state,
        ({ _customBooleanFormatters, ...oldState }): WeddingMetadata => ({
          ...oldState,
          _customBooleanFormatters: [..._customBooleanFormatters, { id: uuidv4(), trueLabel, falseLabel }],
        }),
      );
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
  })),
);
