using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using System.Configuration;
using Coypu;
using Coypu.Drivers;
using ITGuys.Tests.PageObjects;

namespace ITGuys.Tests
{
    [TestFixture]
    public class GivenITGuys
    {
        private BrowserSession _browserSession;

        [SetUp]
        public void SetUp()
        {            
            _browserSession = new BrowserSession(new SessionConfiguration
            {
                AppHost = ConfigurationSettings.AppSettings["AppHost"],
                Port = 80,
                Browser = Browser.Chrome,
                Timeout = TimeSpan.FromSeconds(30),
                RetryInterval = TimeSpan.FromSeconds(0.1)
            });
            _browserSession.MaximiseWindow();            
        }

        [TearDown]
        public void TearDown()
        {            
            _browserSession.Driver.Dispose();
            _browserSession.Dispose();
        }

        [Test]
        public void WhenViewingImportantPeopleInITThenDateOfBirthIsCorrect()
        {
            _browserSession.Visit("/ITGuys/v3.htm");
            var iTGuysPage = new ITGuysPage(_browserSession);

            Assert.That(iTGuysPage.GetHeading(), Is.EqualTo("Important People in IT"));
            Assert.That(iTGuysPage.GetSubHeading(), Is.EqualTo("Version 3"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Tommy", "Flowers"), Is.EqualTo("22/12/1905"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Bob", "Kahn"), Is.EqualTo("23/12/1938"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Larry", "Ellison"), Is.EqualTo("17/08/1944"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Scott", "McNealy"), Is.EqualTo("13/11/1954"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Steve", "Jobs"), Is.EqualTo("24/02/1955"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Tim", "Berners-Lee"), Is.EqualTo("08/06/1955"));
            Assert.That(iTGuysPage.GetDateOfBirthBy("Bill", "Gates"), Is.EqualTo("28/10/1955"));
        }
    }
}
