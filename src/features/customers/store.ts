import { create } from 'zustand';
import { SAMPLE_CLIENTS, type Client } from './types';

type ClientsState = {
  clients: Client[];
};

export const useClientsStore = create<ClientsState>(() => ({
  clients: SAMPLE_CLIENTS,
}));
