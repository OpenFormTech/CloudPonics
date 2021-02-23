# Database Schema

## Conventions
- Shallow lists for sets (i.e. `runlist` for `runs`) are created for shallow querying. They are __UNIDIRECTIONALLY__ maintained by Firebase Cloud Functions - i.e. removing a run object from `runs` removes the run's UUID from the `runlist`, but not vice versa. Prevents unintentional data loss.
- Timestamps are _milliseconds UTC_ (since Jan. 1 1970).
- UUIDs (other than user) are __UUID V4__. They are often structured with some identifying feature (i.e. device UUID `peapod-{UUIDV4}`, project UUID `basil-{UUIDV4}` for a project about basil, run UUID prefix matching that of the encapsulating project).
- Program phase durations are in _seconds_.
- Dataset labels and program variable labels are __lowercase hyphenated__. Replace hyphens with spaces and change to titlecase for proper printable name.


## Data
1. _Users_: The `users` set contains the user UUIDs that have logged in, as well as each user's metadata (fist recorded login, latest recorded login, etc.). There are also shallow lists for each user's owned runs, projects, and devices - all via UUID. Metadata is maintained by Firebase Cloud Functions on each login. The shallow ownership lists are populated and deleted by Firebase Cloud Functions _manually_ on object _creation_ (via the __CloudPonics__ app) and _automatically_ on _deletion_.
2. _Devices_: The `devices` set contains the device UUIDs that have been registered by Google IoT Core, populated via Firebase Cloud Functions. This set contains each device's metadata (registration timestamp, latest recorded startup, owner user UUID), state, info (name, etc.), and which run this device is currently working on (UUID, defaults to `null`). Metadata is maintained by Firebase Cloud Functions on each login. State and run are populated by the device. Info is populated by the user (via the __CloudPonics__ app).
3. _Programs_: The `programs` set contains all programs in JSON format, listed by UUID. Programs outline the sequence of environment _phases_ in the plant's growth cycle. Each phase holds the settings for each of the device's actionable environment variables (i.e. `air-temperature`, `led-blue-power`, etc.) over a given duration; the program does not tell the device _how_ to set its actuators, merely the _target values_ for the variables. Naturally, the sum of all the phases' durations is the total duration of the program. Programs can only be associated with __one__ project. A project can (and likely will) have __many__ programs.
4. _Runs and Data_: The `runs` set contains all runs, listed by UUID. The `runlist` is the shallow query for this set, maintained by Firebase Cloud Function. Runs are the primary unit of data collection - a run is equivalent to one full execution of a program. Runs are 'published' by the device, creating the run, datasets, and info (associated device UUID, run name, completion status (default false), associated program UUID). The `data` set inside a run contains all datasets by their label (i.e. `air-temperature`, `ppm-co2`, etc.). Each dataset contains a set of data points (auto-generated UUID) containing the timestamp and value of the data point. Metadata is populated by Firebase Cloud Functions on run creation.
5. _Projects_: The `projects` set contains all projects, listed by UUID. The `projectlist` is the shallow query for this set, maintained by Firebase Cloud Function. Projects are the largest unit of activity - a project is essentially a container of similar runs of the _same species_ and the programs they employ. 

## Permissions

- Permissions (all imply authenticated, CASCADING)
    - `projects/$projectid/metadata`
        - .write `.../metadata/owner` == auth.uid or `projects/$projectid` doesn't exist
        - .read: true
    - `.../runs/$runid/metadata`
        - .write: if `.../metadata/owner` == auth.uid or `runs/$runid` doesn't exist
        - .read: true
    - `.../runs/$runid/data/$index`
        - .write: if `.../metadata/owner` == auth.uid and !data.exists()
        - .validate: newData.hasChildren(['timestamp'],['value']) and newData.child('timestamp').isNumber() and newData.child('value').isNumber()