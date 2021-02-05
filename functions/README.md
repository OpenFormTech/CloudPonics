# CloudPonics Cloud Functions

## Run Caching

Firestore billing is *read-count-dependent*, so the read-only fields of run documents are cached in the Cloud Functions server instance. This way, when (for example) checking to see if a device ID matches the one in a run's metadata, you don't need to perform a read every time, only once -> cache it, then in future grab from cache.

See `IRunCache` interface for data structure.

# PubSub Data Endpoint

> Endpoint: `data`

Routes data from [IoT devices](https://github.com/OpenFormTech/PeaPod) to the right spot in the Firestore database in accordance with metadata (project ID, run ID, device ID).

## Data Structure

See `IData` interface for data structure.

> Note: timestamp is `ms` UTC.