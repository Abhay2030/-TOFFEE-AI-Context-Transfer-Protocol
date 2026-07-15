# Bidirectional Cloud Sync Implementation

The Toffee extension currently has a primitive sync loop that blindly uploads new captures to the backend. To deliver a true "Cloud Sync" experience across devices, we need a robust, bidirectional sync engine that pushes local changes, pulls remote bundles, handles deletions, and strictly respects the user's "Cloud Sync" toggle preference.

## User Review Required

> [!IMPORTANT]
> The current sync loop blindly uploads your captures to the cloud if you are logged in, ignoring the "Cloud Sync" toggle setting. This plan will enforce strict privacy by completely disabling background uploads unless Cloud Sync is explicitly enabled. 

## Open Questions

> [!NOTE]
> 1. Do you want to support manual syncing (e.g. adding a "Sync Now" button in the library) or rely entirely on background auto-syncing when the toggle is on?
> 2. Should we show a "Syncing..." loading indicator in the Library UI while the background worker is pulling down new bundles?

## Proposed Changes

### Extension Background (`packages/extension/src/background/`)

#### [MODIFY] `index.ts`
- Extract the sync logic into a dedicated module, or upgrade the existing `processSyncQueue` function.
- Add a strict check against `chrome.storage.local` to ensure `toffee_settings.cloudSync` is `true` before initiating any network requests.
- Add a message listener for `MANUAL_SYNC_TRIGGER` so the UI can force a sync.

#### [NEW] `syncEngine.ts`
- **Push Engine**: Upload local un-processed bundles to `POST /v1/bundles` (migrating the existing logic here).
- **Pull Engine**: 
  - Call `GET /v1/bundles` to retrieve the list of all remote bundles.
  - Diff the remote IDs against the local Dexie `db.bundles`.
  - For any missing IDs, call `GET /v1/bundles/:id` to retrieve the S3 pre-signed `downloadUrl`.
  - Fetch the bundle data from S3 and insert it into the local Dexie database.
- **Delete Engine**: Process items in the `syncQueue` table of type `delete` by sending `DELETE /v1/bundles/:id` requests to the backend.

### Extension UI & State (`packages/extension/src/popup/`)

#### [MODIFY] `stores/libraryStore.ts`
- When deleting a bundle via `removeBundle`, push a `delete` operation to the Dexie `syncQueue` before deleting it from the local store.
- Send a message to the background worker to immediately process the sync queue.

#### [MODIFY] `stores/settingsStore.ts`
- When `toggleCloudSync` is triggered:
  - Save the updated preference to `chrome.storage.local` so the background worker can read it.
  - If turning *on*, send a message to the background worker to trigger an immediate initial sync.

## Verification Plan

### Automated/Unit Tests
- Verify that `cloudSync: false` perfectly blocks all backend API calls.

### Manual Verification
1. Create a bundle locally with Cloud Sync off. Verify it does not appear on the backend database.
2. Turn Cloud Sync on. Verify the bundle is immediately pushed to the backend.
3. Simulate another device by manually inserting a bundle into the PostgreSQL backend. Verify the extension automatically pulls it down into the local IndexedDB and displays it in the Memory Crystal Library.
4. Delete a bundle from the UI. Verify it is removed from the local database and a `DELETE` request is sent to the backend.
