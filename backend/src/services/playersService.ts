import { ApiSportsClient } from "../utils/apiSportsClient";

export class PlayersService {
  constructor(private api: ApiSportsClient) {}

  async getPlayerStats(playerId: number) {
    return this.api.getPlayerStats(playerId);
  }
}
