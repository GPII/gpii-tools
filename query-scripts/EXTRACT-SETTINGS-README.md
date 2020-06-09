# Extract Settings

This utility will go through a solutions registry file of the GPII and extract
all the JSON schemas for each `supportedSetting`, and then create a sparse table
for each setting using that information.

## Description of output

A sample of the output is located in this repo locations as `out.csv`. The columns are
as follows:

* appId - The GPII id of the solution
* settingId - the id of the settings. The combination of `appId` and `settingId` is the
   unique identifier for any particular setting.
* appName - Human friendly name of the application.
* title - Title of the settings
* description - Description of the setting
* default - default value
* type (optionally sparse) - JSON Schema type
* enum (optionally sparse) - If the type is an enum these are the choices
* enumLabels (optionally sparse) - The labels for an enum if present
* minimum (optionally sparse) - `minimum` for `number` types.
* maximum (optionally sparse) - `maximum` for `number` types.
* oneOf (optionally sparse) - `oneOf` for slightly more complex JSON schemas that allow
  the follow to be validated among a list of possibilities.
* multipleOf (optionally sparse) - `multipleOf` for `number` types.
* schema - Entire JSON schema for this setting, which the above columns have been
  extracted from. In the event of more complex settings, it may be necessary to view
  the entire schema. The `optionally sparse` columns above are just the best estimate
  for the majority of common fields.

## Running

At the time of writing we are using the `win32.json5` file from GPII-2839. This file
needs to be fetched, converted to `json` and then ran through the extraction script.
You should have `curl`, `jq`, `json5`, and `json2csv` installed. `json5` and `json2csv`
can be installed from npm.

The output will be in `out.csv`.

```bash
curl -O https://raw.githubusercontent.com/the-t-in-rtf/universal/GPII-2839/testData/solutions/win32.json5
json5 win32.json5 > win32.json
./extract-settings.sh
```
