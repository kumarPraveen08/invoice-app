import { create } from 'zustand';
import { SAMPLE_CLIENTS, type Client } from './types';

type ClientsState = {
  clients: Client[];
  removeClient: (id: string) => void;
  addClients: (clients: Client[]) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: SAMPLE_CLIENTS,
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  addClients: (clients) =>
    set((state) => ({ clients: [...state.clients, ...clients] })),
}));
