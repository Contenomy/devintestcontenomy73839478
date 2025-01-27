using Contenomy.Data.Influx.Entities;
using Contenomy.Data.Influx.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contenomy.Data.Influx
{
    public class InfluxSeedService
    {
        private readonly InfluxService _influxService;
        private readonly Random _random;
        private const double MAX_DAILY_OSCILLATION = 0.02; // 2% max daily oscillation
        private const double MONTHLY_TREND = 0.05; // 5% monthly trend variation

        public InfluxSeedService(InfluxService influxService)
        {
            _influxService = influxService ?? throw new ArgumentNullException(nameof(influxService));
            _random = new Random();
        }

        public async Task SeedHistoricalDataForCreator(string creatorId, double basePrice)
        {
            var startDate = new DateTime(2024, 11, 1);
            var endDate = new DateTime(2025, 1, 29);
            var currentDate = startDate;
            var currentPrice = basePrice;

            // Calculate monthly trend direction (-1 or 1)
            var monthlyTrendDirection = _random.NextDouble() > 0.5 ? 1 : -1;
            var monthlyChange = (1 + (monthlyTrendDirection * MONTHLY_TREND));

            while (currentDate <= endDate)
            {
                // First 7 days: 5-minute intervals
                if (currentDate < startDate.AddDays(7))
                {
                    await Generate5MinuteData(creatorId, ref currentPrice, currentDate, currentDate.AddDays(1), monthlyChange);
                    currentDate = currentDate.AddDays(1);
                }
                // Next 30 days: hourly intervals
                else if (currentDate < startDate.AddDays(37))
                {
                    await GenerateHourlyData(creatorId, ref currentPrice, currentDate, currentDate.AddDays(1), monthlyChange);
                    currentDate = currentDate.AddDays(1);
                }
                // Remaining days: daily intervals
                else
                {
                    await GenerateDailyData(creatorId, ref currentPrice, currentDate, monthlyChange);
                    currentDate = currentDate.AddDays(1);
                }
            }
        }

        private async Task Generate5MinuteData(string creatorId, ref double currentPrice, DateTime date, DateTime nextDate, double monthlyChange)
        {
            var intervalsPerDay = 288; // 5-minute intervals in a day
            var volatility = MAX_DAILY_OSCILLATION / Math.Sqrt(intervalsPerDay);
            var dailyTrend = Math.Pow(monthlyChange, 1.0 / 30.0);

            for (int i = 0; i < intervalsPerDay; i++)
            {
                var timestamp = date.AddMinutes(i * 5);
                if (timestamp >= nextDate) break;

                var randomChange = ((_random.NextDouble() * 2) - 1) * volatility;
                var trendChange = (dailyTrend - 1.0) / intervalsPerDay;
                currentPrice *= (1 + randomChange + trendChange);
                
                _influxService.WriteNewShareValue(currentPrice, creatorId);
            }
        }

        private async Task GenerateHourlyData(string creatorId, ref double currentPrice, DateTime date, DateTime nextDate, double monthlyChange)
        {
            var intervalsPerDay = 24; // Hours in a day
            var volatility = MAX_DAILY_OSCILLATION / Math.Sqrt(intervalsPerDay);
            var dailyTrend = Math.Pow(monthlyChange, 1.0 / 30.0);

            for (int i = 0; i < intervalsPerDay; i++)
            {
                var timestamp = date.AddHours(i);
                if (timestamp >= nextDate) break;

                var randomChange = ((_random.NextDouble() * 2) - 1) * volatility;
                var trendChange = (dailyTrend - 1.0) / intervalsPerDay;
                currentPrice *= (1 + randomChange + trendChange);
                
                _influxService.WriteNewShareValue(currentPrice, creatorId);
            }
        }

        private async Task GenerateDailyData(string creatorId, ref double currentPrice, DateTime date, double monthlyChange)
        {
            var dailyTrend = Math.Pow(monthlyChange, 1.0 / 30.0);
            var randomChange = ((_random.NextDouble() * 2) - 1) * MAX_DAILY_OSCILLATION;
            currentPrice *= (1 + randomChange + (dailyTrend - 1.0));
            
            _influxService.WriteNewShareValue(currentPrice, creatorId);
        }
    }
}
