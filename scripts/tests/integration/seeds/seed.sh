#!/bin/bash

echo "Seeding..."

# echo "-- [1] Hello World --"
# curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/hello-world/_bulk --data-binary "@hello-world.ndjson"
# curl elasticsearch:9200/hello-world

echo "|---------------------- "
echo "| "
echo "| "
echo "| [1] SEEDING ..."
echo "| "
echo "| "
echo "| ----- [1.1] ICT Plus: Device data --"
curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/ict_plus_device_data/_bulk --data-binary "@ict-plus-sample.ndjson"
# curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/ict_plus_device_data/_bulk --data-binary "@devices.4268.ndjson"
curl elasticsearch:9200/ict_plus_device_data

echo "|---------------------- "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| "
echo "|----- [1.2] ICT Plus: School picker / BUD  --"
curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/ict_plus_school_data/_bulk --data-binary "@school.ndjson"
curl elasticsearch:9200/ict_plus_school_data

# echo "----- [1.3] ICT Plus: Release  --"
# curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/ict_plus_release_year_data/_bulk --data-binary "@ict_plus_sccm_release_year.ndjson"
# curl elasticsearch:9200/ict_plus_release_year_data

echo "|---------------------- "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| "
echo "|----- [1.4] ICT Plus: Fiblog/ict_plus_fib_hourly_history  --"
curl -s -H "Content-Type: application/x-ndjson" -XPOST elasticsearch:9200/ict_plus_fib_hourly_history/_bulk --data-binary "@fiblog.ndjson"
curl elasticsearch:9200/ict_plus_fib_hourly_history


echo "|---------------------- "
echo "| "
echo "| "
echo "| [2] Modify"
echo "| "
echo "| "
echo "|------ [2.0] Watermark  ------"
# curl -X PUT elasticsearch:9200/_cluster/settings \
  # -H 'Content-Type: application/json' \
  # -d '{ "transient": { "cluster.routing.allocation.disk.watermark.low": "100gb", "cluster.routing.allocation.disk.watermark.high": "100gb", "cluster.routing.allocation.disk.watermark.flood_stage": "100gb", "cluster.info.update.interval": "1m" } }'

echo "|---------------------- "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| "
echo "|------ [2.1] form_factor field - Set fielddata true on searchable fields  --"
curl -X PUT elasticsearch:9200/ict_plus_device_data/_doc/_mapping \
  -H 'Content-Type: application/json' \
  -d '{ "_doc" : { "properties": { "form_factor": { "type": "text", "fielddata": true, "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } } } } }'

echo "|---------------------- "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| "
echo "|------ [2.2] Model field - Set fielddata true on searchable fields  --"
curl -X PUT elasticsearch:9200/ict_plus_device_data/_doc/_mapping \
  -H 'Content-Type: application/json' \
  -d '{ "_doc" : { "properties": { "model": { "type": "text", "fielddata": true, "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } } } } }'


echo "|---------------------- "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| "
echo "| ------ [2.3] Warranty field - Set fielddata true on searchable fields  --"
curl -X PUT elasticsearch:9200/ict_plus_device_data/_doc/_mapping \
  -H 'Content-Type: application/json' \
  -d '{ "_doc" : { "properties": { "warranty": { "type": "date", "fielddata": true } } } }'



#  curl -X DELETE localhost:9200/ict_plus_device_data