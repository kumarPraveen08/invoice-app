import { create } from 'zustand';
import { SAMPLE_CLIENTS, type Client } from './types';

type ClientsState = {
  clients: Client[];
  removeClient: (id: string) => void;
  addClients: (clients: Client[]) => void;
  upsertClient: (client: Client) => void;
};

export const useClientsStore = create<ClientsState>((set) => ({
  clients: SAMPLE_CLIENTS,
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
  addClients: (clients) =>
    set((state) => ({ clients: [...state.clients, ...clients] })),
  upsertClient: (client) =>
    set((state) => {
      const index = state.clients.findIndex((row) => row.id === client.id);
      if (index === -1) {
        return { clients: [client, ...state.clients] };
      }
      const clients = [...state.clients];
      clients[index] = client;
      return { clients };
    }),
}));
