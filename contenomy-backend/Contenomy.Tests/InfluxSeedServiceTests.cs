using Contenomy.Data.Influx;
using Contenomy.Data.Influx.Entities;
using Contenomy.Data.Influx.Enums;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contenomy.Tests
{
    [TestClass]
    public class InfluxSeedServiceTests
    {
        private InfluxService _influxService;
        private InfluxSeedService _seedService;
        private const string TEST_CREATOR_ID = "test-creator-123";

        [TestInitialize]
        public void Setup()
        {
            // Using the same configuration as the main application
            _influxService = new InfluxService(
                "GoUyhst0HGOYj7S1BRrsAZ54cFKZidsl1bvBVtCfJqvReq6X_ARWybe2Y97KzllzFYimNMObyn-zCBt-t4k2lg==",
                "http://localhost:8086",
                "contenomy",
                "contenomy"
            );
            _seedService = new InfluxSeedService(_influxService);
        }

        [TestMethod]
        public async Task SeedHistoricalData_GeneratesCorrectDateRange()
        {
            // Arrange
            double basePrice = 5.0;

            // Act
            await _seedService.SeedHistoricalDataForCreator(TEST_CREATOR_ID, basePrice);
            var result = await _influxService.ReadTrend(TEST_CREATOR_ID, Periods.ALL) as List<TrendPoint>;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());

            var startDate = new DateTime(2024, 11, 1);
            var endDate = new DateTime(2025, 1, 29);

            // Verify date range
            var firstPoint = result.Min(p => p.Timestamp);
            var lastPoint = result.Max(p => p.Timestamp);

            Assert.IsTrue(firstPoint >= startDate.AddDays(-1));
            Assert.IsTrue(lastPoint <= endDate.AddDays(1));
        }

        [TestMethod]
        public async Task SeedHistoricalData_GeneratesCorrectPriceVariations()
        {
            // Arrange
            double basePrice = 5.0;

            // Act
            await _seedService.SeedHistoricalDataForCreator(TEST_CREATOR_ID, basePrice);
            var result = await _influxService.ReadTrend(TEST_CREATOR_ID, Periods.ALL) as List<TrendPoint>;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());

            // Check daily variations (should be within ±2%)
            var dailyChanges = new List<double>();
            var previousDayPrice = result[0].Value;
            var currentDate = result[0].Timestamp.Date;

            foreach (var point in result.Skip(1))
            {
                if (point.Timestamp.Date != currentDate)
                {
                    var dailyChange = Math.Abs((point.Value - previousDayPrice) / previousDayPrice);
                    dailyChanges.Add(dailyChange);
                    previousDayPrice = point.Value;
                    currentDate = point.Timestamp.Date;
                }
            }

            Assert.IsTrue(dailyChanges.All(change => change <= 0.02), "Daily price changes should not exceed 2%");

            // Check monthly trend (should be within ±5%)
            var monthlyChanges = new List<double>();
            var monthlyPrices = result
                .GroupBy(p => new { p.Timestamp.Year, p.Timestamp.Month })
                .Select(g => g.Average(p => p.Value))
                .ToList();

            for (int i = 1; i < monthlyPrices.Count; i++)
            {
                var monthlyChange = Math.Abs((monthlyPrices[i] - monthlyPrices[i - 1]) / monthlyPrices[i - 1]);
                monthlyChanges.Add(monthlyChange);
            }

            Assert.IsTrue(monthlyChanges.All(change => change <= 0.05), "Monthly price changes should not exceed 5%");
        }

        [TestMethod]
        public async Task SeedHistoricalData_GeneratesCorrectDataGranularity()
        {
            // Arrange
            double basePrice = 5.0;
            var startDate = new DateTime(2024, 11, 1);

            // Act
            await _seedService.SeedHistoricalDataForCreator(TEST_CREATOR_ID, basePrice);
            var result = await _influxService.ReadTrend(TEST_CREATOR_ID, Periods.ALL) as List<TrendPoint>;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());

            // First 7 days should have 5-minute intervals
            var firstWeekData = result.Where(p => p.Timestamp < startDate.AddDays(7)).ToList();
            var fiveMinuteIntervals = firstWeekData
                .Zip(firstWeekData.Skip(1), (a, b) => (b.Timestamp - a.Timestamp).TotalMinutes)
                .Distinct()
                .ToList();

            Assert.IsTrue(fiveMinuteIntervals.All(i => Math.Abs(i - 5) < 1), "First week should have 5-minute intervals");

            // Next 30 days should have hourly intervals
            var nextMonthData = result.Where(p => 
                p.Timestamp >= startDate.AddDays(7) && 
                p.Timestamp < startDate.AddDays(37)).ToList();
            var hourlyIntervals = nextMonthData
                .Zip(nextMonthData.Skip(1), (a, b) => (b.Timestamp - a.Timestamp).TotalHours)
                .Distinct()
                .ToList();

            Assert.IsTrue(hourlyIntervals.All(i => Math.Abs(i - 1) < 0.1), "Next month should have hourly intervals");

            // Remaining days should have daily intervals
            var remainingData = result.Where(p => p.Timestamp >= startDate.AddDays(37)).ToList();
            var dailyIntervals = remainingData
                .Zip(remainingData.Skip(1), (a, b) => (b.Timestamp - a.Timestamp).TotalDays)
                .Distinct()
                .ToList();

            Assert.IsTrue(dailyIntervals.All(i => Math.Abs(i - 1) < 0.1), "Remaining period should have daily intervals");
        }
    }
}
