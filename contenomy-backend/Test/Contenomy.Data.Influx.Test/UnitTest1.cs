namespace Contenomy.Data.Influx.Test
{
    [TestClass]
    public class UnitTest1
    {
        private InfluxService _service;

        [TestInitialize]
        public void Initialize()
        {
            _service = new("yyEp3vSLUls8wnymCKyHXvKh0yqB3YBODFf4vGf_jVVEsue5XW-GHlRG6TfwElA2IdX9ycmDEVlADPc7lktUIA==", "http://127.0.0.1:8086", "market_flow", "Contenomy");
        }

        [TestMethod]
        public void TestWrite()
        {
            for (int i = 0; i < 10000; ++i)
            {
                var random = new Random();  
                Assert.IsTrue(_service.WriteNewShareValue(random.NextDouble() * 10, "Test_creator"));
                Assert.IsTrue(_service.WriteNewShareValue(random.NextDouble() * 10, "Test_creator2"));
                Assert.IsTrue(_service.WriteNewShareValue(random.NextDouble() * 10, "Test_creator3"));
                Assert.IsTrue(_service.WriteNewShareValue(random.NextDouble() * 10, "Test_creator4"));
                Assert.IsTrue(_service.WriteNewShareValue(random.NextDouble() * 10, "Test_creator5"));
            }
        }

        [TestMethod]
        public void TestQuery()
        {
            var result = _service.ReadTrend("Test_creator", Enums.Periods.DAY7).Result;
            Assert.IsNotNull(result);
        }
    }
}