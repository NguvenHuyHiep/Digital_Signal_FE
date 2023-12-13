import { Playlist } from './playlist';

export interface DashBoardStatictist {
  totalOfflineDevices?: number;
  totalOnlineDevices?: number;
  totalDeviceGroups?: number;
  totalPlaylists?: number;
  lastPlaylist?: Playlist;
}
