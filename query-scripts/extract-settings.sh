#!/bin/bash

# Currently we are using a version of Atkins fixed up Windows Solutions
# from GPII-2839
# curl -O https://raw.githubusercontent.com/the-t-in-rtf/universal/GPII-2839/testData/solutions/win32.json5

# This then needs to be converted to regular JSON,
# json5 win32.json5 > win32.json

jq '[. | to_entries[] | {
    appId: .key,
    name: .value.name,
    setting: .value.settingsHandlers?[]?.supportedSettings? | to_entries[]
} | {
    appId: .appId,
    settingId: .setting.key,
    appName: .name,
    title: .setting.value.schema.title,
    description: .setting.value.schema.description,
    default: .setting.value.schema.default?,
    type: .setting.value.schema.type?,
    enum: .setting.value.schema.enum?,
    enumLabels: .setting.value.schema.enumLabels?,
    minimum: .setting.value.schema.minimum?,
    maximum: .setting.value.schema.maximum?,
    oneOf: .setting.value.schema.oneOf?,
    multipleOf: .setting.value.schema.multipleOf?,
    schema: .setting.value.schema
}]' < win32.json > out.json
json2csv -i out.json > out.csv
