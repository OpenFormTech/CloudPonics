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

# New User

Populates user object on new user authentication. Copies defaults from `users/default`, then adds this user's specific field values.

# Device Registry

Checks user registry limits, then registers a new [IoT device](https://github.com/OpenFormTech/PeaPod) to the GCP IoT Core registry. Populates user device list (`users/uid/devices`), as well as devices list (`devices/deviceid`) with device fields (i.e. name, timestamp).

# Project, Run, Program Creation

> Note: for security reasons, **user `uid` is a *required* document field populated by the client**, as [Firestore does not support contextual auth](https://stackoverflow.com/a/47558027). Is is checked, copied to an `owner` field (which is **write-protected**), and then deleted, all by the Cloud Function.