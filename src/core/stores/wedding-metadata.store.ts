import { editByProp, removeByProp } from '@12luckydev/utils';
import { computed, effect, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed, withHooks, getState } from '@ngrx/signals';
import { v4 as uuidv4 } from 'uuid';
import {
  BooleanFormatter,
  WeddingMetadata,
  WeddingMetadataModel,
  WeddingMetadataStorage,
  WeddingMetadataStorageModel,
} from '../models';
import { WeddingStorageService } from '../services';

export const WeddingMetadataStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingMetadata>(() => inject(WeddingStorageService).getWeddingMetadataConfig()),
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
    importBacklog(storage: WeddingMetadataStorage) {
      const weddingMetadata: WeddingMetadata = new WeddingMetadataModel(storage);
      patchState(state, () => weddingMetadata);
    },
    exportBacklog(): WeddingMetadataStorage {
      const weddingMetadata: WeddingMetadata = getState(state);
      return new WeddingMetadataStorageModel(weddingMetadata);
    },
  })),
  withHooks({
    onInit(store) {
      const weddingStorageService = inject(WeddingStorageService);
      let initialRun = true;

      effect(() => {
        const state: WeddingMetadata = getState(store);
        if (!initialRun) {
          weddingStorageService.setWeddingMetadataConfig(state);
        }
        initialRun = false;
      });
    },
  }),
);
