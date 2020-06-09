#!/bin/bash

# jq script to pull out the solution id, settings configuration id, and inverse capability transform
# for settings that have one
#
# ./pull-inverse-capabilities-transforms.sh ~/code/gpii-universal/testData/solutions/win32.json5 > out.json

json5 $1 | jq '[. | to_entries[] | {
    appId: .key,
    name: .value.name,
    settingsHandlers: .value?.settingsHandlers[]?
} | {
    appId: .appId,
    name: .name,
    inverseCapabilitiesTransformations: .settingsHandlers.inverseCapabilitiesTransformations
}]'
