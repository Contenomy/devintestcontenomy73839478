using Contenomy.Data.Influx.Entities;
using Contenomy.Data.Influx.Enums;
using InfluxDB.Client;
using InfluxDB.Client.Api.Domain;
using InfluxDB.Client.Core.Flux.Domain;
using InfluxDB.Client.Writes;

namespace Contenomy.Data.Influx
{
    public class InfluxService
    {
        private static readonly Dictionary<Periods, string> _aggregations = new Dictionary<Periods, string>
        {
            {Periods.DAY1, "1h"},
            {Periods.DAY7, "1h"},
            {Periods.MONTH1, "1d"},
            {Periods.YEAR1, "7d"},
            {Periods.YTD, "7d"},
            {Periods.ALL, "7d"},
        };

        //GoUyhst0HGOYj7S1BRrsAZ54cFKZidsl1bvBVtCfJqvReq6X_ARWybe2Y97KzllzFYimNMObyn-zCBt-t4k2lg==
        private string _token;
        private string _server;
        private string _bucket;
        private string _org;

        public InfluxService(string token, string server, string bucket, string org)
        {
            _token = token;
            _server = server;
            _bucket = bucket;
            _org = org;
        }

        public bool WriteNewShareValue(double newValue, string creatorId)
        {

            return Write(writeApi =>
            {
                var point = PointData.Measurement("shareValue")
                    .Tag("creator", creatorId)
                    .Field("value", newValue)
                    .Timestamp(DateTime.UtcNow, WritePrecision.Ms);
                writeApi.WritePointAsync(point, _bucket, _org).Wait();
            });
        }

        public async Task<object> ReadTrend(string creatorId, Periods period)
        {
            var aggregation = _aggregations[period];

            var thisYear = new DateTime(DateTime.UtcNow.Year, 1, 1).ToString("yyyy-MM-ddTHH:mm:ssZ");

            var filter = period switch
            {
                Periods.DAY1 => "|> range(start: -1d)\n",
                Periods.DAY7 => "|> range(start: -7d)\n",
                Periods.MONTH1 => "|> range(start: -1mo)\n",
                Periods.YEAR1 => "|> range(start: -1y)\n",
                Periods.YTD => $"|> range(start: {thisYear}, stop: now())\n",
                _ => $"|> range(start: 2024-11-10T00:00:00Z, stop: now())\n",
            };

            var query = $"from(bucket: \"{_bucket}\")\n" +
                filter+
                $"|> filter(fn: (r) => r._measurement == \"shareValue\" and r.creator == \"{creatorId}\")\n" +
                $"|> aggregateWindow(every: {aggregation}, fn: mean, createEmpty: true)\n" +
                $"|> fill(usePrevious: true)\n" +
                $"|> filter(fn: (r) => exists r._value)";

            return await Read<List<TrendPoint>>(async readApi =>
            {
                var list = await readApi.QueryAsync(query, _org);

                if (list.Count <= 0)
                {
                    return [];
                }

                return list[0].Records.Select(f => new TrendPoint
                {
                    Timestamp = Convert.ToDateTime(f.GetTimeInDateTime()),
                    Value = Convert.ToDouble(f.GetValue())
                }).ToList();
            });

        }

        public bool Write(Action<WriteApiAsync> action)
        {
            using var client = new InfluxDBClient(_server, _token);
            try
            {
                var write = client.GetWriteApiAsync();
                action(write);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<T> Read<T>(Func<QueryApi, Task<T>> action)
        {
            using var client = new InfluxDBClient(_server, _token);
            return await action(client.GetQueryApi());
        }
    }
}
